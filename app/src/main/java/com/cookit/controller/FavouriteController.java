package com.cookit.controller;

import com.cookit.service.FavouriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/favourites")
public class FavouriteController {

    @Autowired
    private FavouriteService favouriteService;

    @PostMapping("/{recipeId}")
    public ResponseEntity<String> addToFavourites(@PathVariable Long recipeId) {
        boolean added = favouriteService.addToFavourites(recipeId);
        if (added) {
            return ResponseEntity.ok("Recipe added to favourites.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not add to favourites.");
        }
    }
}
