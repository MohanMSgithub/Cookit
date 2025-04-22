package com.cookit.service;

import com.cookit.model.User;
import com.cookit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; // ✅ Inject EmailService

    public String signup(User user) {
        boolean exists = userRepository.findByEmail(user.getEmail()).isPresent();
        if (exists) {
            return "User already exists!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "Signup successful!";
    }

    public String login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return "/html/home.html";
            }
        }
        return "Invalid credentials";
    }

    public String generateResetToken(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
            userRepository.save(user);

            // ✅ Send reset email
            emailService.sendResetLink(email, token);

            return "Reset link sent!";
        }
        return "Email not found.";
    }

    public String resetPassword(String token, String newPassword) {
        Optional<User> optionalUser = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()) && u.getTokenExpiry() != null && u.getTokenExpiry().isAfter(LocalDateTime.now()))
                .findFirst();

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setTokenExpiry(null);
            userRepository.save(user);
            return "Password updated successfully!";
        }

        return "Invalid or expired token.";
    }
}
