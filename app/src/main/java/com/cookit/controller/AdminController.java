package com.cookit.controller;

import com.cookit.model.Category;
import com.cookit.model.Recipe;
import com.cookit.model.User;
import com.cookit.repository.CategoryRepository;
import com.cookit.repository.RecipeRepository;
import com.cookit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private RecipeRepository recipeRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    // 🔹 Get all recipes
    @GetMapping("/recipes")
    public List<Recipe> getAllRecipes() {
        return recipeRepo.findAll();
    }

    // 🔹 Add new recipe with multiple category IDs
    @PostMapping("/recipes")
    public ResponseEntity<Recipe> addRecipe(
            @RequestBody Recipe recipe,
            @RequestParam List<Long> categoryIds
    ) {
        List<Category> categories = categoryRepo.findAllById(categoryIds);
        if (categories.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        recipe.setCategories(new HashSet<>(categories));
        Recipe saved = recipeRepo.save(recipe);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Update recipe and optionally its categories
    @PutMapping("/recipes/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestBody Recipe updatedRecipe,
            @RequestParam(required = false) List<Long> categoryIds
    ) {
        return recipeRepo.findById(id).map(recipe -> {
            recipe.setName(updatedRecipe.getName());
            recipe.setShortDescription(updatedRecipe.getShortDescription());
            recipe.setFullDescription(updatedRecipe.getFullDescription());
            recipe.setImageUrl(updatedRecipe.getImageUrl());

            if (categoryIds != null && !categoryIds.isEmpty()) {
                List<Category> categories = categoryRepo.findAllById(categoryIds);
                recipe.setCategories(new HashSet<>(categories));
            }

            return ResponseEntity.ok(recipeRepo.save(recipe));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Delete recipe
    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        if (recipeRepo.existsById(id)) {
            recipeRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
