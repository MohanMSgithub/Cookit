package com.cookit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendResetLink(String to, String token) {
        String resetUrl = "http://localhost:8080/html/reset_password.html?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("CookIt - Password Reset Link");
        message.setText("Click the following link to reset your password:\n\n" + resetUrl + "\n\nThis link will expire in 15 minutes.");

        mailSender.send(message);
    }
}
git branch -m old-branch-name new-branch-name
