package com.novatechsolution.notifications.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.novatechsolution.settings.service.SiteSettingsService;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor @Slf4j
public class NotificationService {
    private final JavaMailSender mailSender;
    private final SiteSettingsService siteSettings;
    @Value("${novatech.notifications.from:no-reply@novatech.cm}") private String from;
    @Value("${novatech.notifications.to:contact@novatech.cm}") private String destination;

    public void notifyCompany(String subject, String body) {
        String recipient = siteSettings.notificationRecipient();
        send(recipient == null ? destination : recipient, subject, body);
    }

    public void send(String to, String subject, String body) {
        if (to == null || to.isBlank()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from); message.setTo(to); message.setSubject(subject); message.setText(body);
            mailSender.send(message);
        } catch (RuntimeException exception) {
            log.warn("Email notification could not be delivered to {}: {}", to, exception.getMessage());
        }
    }
}
