package com.novatechsolution.audit.service;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@RequiredArgsConstructor
public class ActivityAuditFilter extends OncePerRequestFilter {
    private final ActivityLogService logs;
    @Override protected boolean shouldNotFilter(HttpServletRequest request){
        String method=request.getMethod();
        return !request.getRequestURI().startsWith(request.getContextPath()+"/api/v1/admin/")
                || !("POST".equals(method)||"PUT".equals(method)||"PATCH".equals(method)||"DELETE".equals(method));
    }
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)throws ServletException,IOException{
        try{chain.doFilter(request,response);}finally{
            Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
            if(authentication!=null&&authentication.isAuthenticated()&&!"anonymousUser".equals(authentication.getName())){
                logs.record(authentication.getName(),request.getMethod(),request.getRequestURI(),response.getStatus());
            }
        }
    }
}
