package com.cookit.controller;

import com.cookit.model.Category;
import com.cookit.model.Recipe;
import com.cookit.repository.CategoryRepository;
import com.cookit.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<?> getRecipes(@RequestParam(required = false) String category) {
        try {
            if (category != null) {
                // Normalize input
                category = category.trim().replaceAll("\\s+", " ");
                System.out.println("🔎 Category from frontend = '" + category + "'");

                // Check if category exists (case-insensitive match)
                Optional<Category> categoryOpt = Optional.ofNullable(categoryRepository.findByNameIgnoreCase(category));
                if (!categoryOpt.isPresent()) {
                    return ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body("❌ Invalid category: " + category);
                }

                List<Recipe> filtered = recipeRepository.findByCategoryNameIgnoreCase(category);
                return ResponseEntity.ok(filtered);
            }

            // If no category is specified, return all recipes
            return ResponseEntity.ok(recipeRepository.findAll());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("⚠️ Server error occurred while fetching recipes.");
        }
    }
}
