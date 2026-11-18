package com.novatechsolution.shared.web;

import tools.jackson.databind.json.JsonMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@Component @RequiredArgsConstructor
public class ApiAccessDeniedHandler implements AccessDeniedHandler {
    private final JsonMapper objectMapper;
    @Override public void handle(HttpServletRequest request,HttpServletResponse response,AccessDeniedException exception)
            throws IOException,ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(),Map.of("timestamp",Instant.now(),"status",403,"message","Accès refusé."));
    }
}
