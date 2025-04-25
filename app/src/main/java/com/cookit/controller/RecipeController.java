package com.cookit.controller;

import com.cookit.model.Category;
import com.cookit.model.Recipe;
import com.cookit.repository.CategoryRepository;
import com.cookit.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all recipes or by category
    @GetMapping
    public List<Recipe> getRecipes(@RequestParam(required = false) String category) {
        if (category != null) {
            Category cat = categoryRepository.findByName(category);
            if (cat != null) {
                return cat.getRecipes();
            }
            return List.of(); // empty list if category not found
        }
        return recipeRepository.findAll();
    }
}

