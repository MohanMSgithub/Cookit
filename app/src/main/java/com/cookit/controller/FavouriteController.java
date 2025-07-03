package com.cookit.controller;

import com.cookit.config.CustomUserDetails;
import com.cookit.service.FavouriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {

    @Autowired
    private FavouriteService favouriteService;


    @PostMapping("/{recipeId}")
    public ResponseEntity<String> addToFavourites(@PathVariable Long recipeId,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in.");
        }

        Long userId = userDetails.getId();

        boolean added = favouriteService.addToFavourites(recipeId, userId);

        if (added) {
            return ResponseEntity.ok("Recipe added to favourites.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not add to favourites.");
        }
    }
}
