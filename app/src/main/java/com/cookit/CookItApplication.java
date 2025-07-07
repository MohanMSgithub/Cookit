package com.cookit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication

@EnableCaching
public class CookItApplication {
    public static void main(String[] args) {
        SpringApplication.run(CookItApplication.class, args);
    }
}
