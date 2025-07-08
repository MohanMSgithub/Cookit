package com.cookit.controller;

import com.cookit.model.User;
import com.cookit.service.UserService;
import com.cookit.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        String result = userService.signup(user);
        if ("Signup successful!".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/do-login")
    public ResponseEntity<?> doLogin(@RequestBody User loginRequest) {
        String result = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if ("/html/home.html".equals(result)) {
            // ✅ Generate JWT
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "redirectUrl", result
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", result));
        }
    }



    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody User request) {
        return userService.generateResetToken(request.getEmail());
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        // Basic validation
        if (token == null || newPassword == null || token.isEmpty() || newPassword.isEmpty()) {
            return "Invalid request";
        }

        return userService.resetPassword(token, newPassword);
    }
}
