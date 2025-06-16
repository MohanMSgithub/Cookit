package com.cookit.controller;

import com.cookit.model.Category;
import com.cookit.model.Recipe;
import com.cookit.repository.CategoryRepository;
import com.cookit.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
                category = category.trim().replaceAll("\\s+", " ");
                System.out.println("🔎 Category from frontend = '" + category + "'");


                Optional<Category> categoryOpt = Optional.ofNullable(categoryRepository.findByNameIgnoreCase(category));
                if (!categoryOpt.isPresent()) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Invalid category: " + category);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                }

                List<Recipe> filtered = recipeRepository.findByCategoryNameIgnoreCase(category);
                return ResponseEntity.ok(filtered);
            }

            return ResponseEntity.ok(recipeRepository.findAll());

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Server error occurred while fetching recipes.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
