package com.novatechsolution.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/** Per-instance fallback rate limit for public forms and login attempts. */
final class PublicFormRateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_TRACKED_CLIENTS = 10_000;
    private static final int CLEANUP_INTERVAL = 128;

    private final int maximumRequests;
    private final long windowMillis;
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();
    private final AtomicLong requestCounter = new AtomicLong();

    PublicFormRateLimitFilter(int maximumRequests, Duration window) {
        if (maximumRequests < 1 || window.isNegative() || window.isZero()) {
            throw new IllegalArgumentException("Rate limit and window must be positive");
        }
        this.maximumRequests = maximumRequests;
        this.windowMillis = window.toMillis();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String path = request.getServletPath();
        return !("/api/v1/auth/login".equals(path)
                || "/api/v1/auth/password/forgot".equals(path)
                || "/api/v1/contact-messages".equals(path)
                || "/api/v1/quote-requests".equals(path)
                || "/api/v1/enrollments".equals(path)
                || "/api/v1/newsletter/subscriptions".equals(path)
                || "/api/v1/newsletter/unsubscribe".equals(path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long now = System.currentTimeMillis();
        if (requestCounter.incrementAndGet() % CLEANUP_INTERVAL == 0) {
            windows.entrySet().removeIf(entry -> now - entry.getValue().startedAt >= windowMillis);
        }

        String key = request.getRemoteAddr() + ':' + request.getServletPath();
        Window current = windows.get(key);
        if (current == null && windows.size() >= MAX_TRACKED_CLIENTS) {
            response.setStatus(429);
            response.setHeader("Retry-After", Long.toString(Math.max(1, windowMillis / 1000)));
            return;
        }

        Window updated = windows.compute(key, (ignored, previous) -> {
            if (previous == null || now - previous.startedAt >= windowMillis) {
                return new Window(now, 1);
            }
            return new Window(previous.startedAt, previous.requests + 1);
        });
        if (updated.requests > maximumRequests) {
            long retryAfter = Math.max(1, (updated.startedAt + windowMillis - now + 999) / 1000);
            response.setStatus(429);
            response.setHeader("Retry-After", Long.toString(retryAfter));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private record Window(long startedAt, int requests) {
    }
}
