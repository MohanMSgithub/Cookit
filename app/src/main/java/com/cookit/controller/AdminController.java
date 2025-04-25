package com.cookit.controller;

import com.cookit.model.Recipe;
import com.cookit.model.User;
import com.cookit.repository.RecipeRepository;
import com.cookit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private RecipeRepository recipeRepo;

    @Autowired
    private UserRepository userRepo;

    // 🔹 Admin: Get all recipes
    @GetMapping("/recipes")
    public List<Recipe> getAllRecipes() {
        return recipeRepo.findAll();
    }

    // 🔹 Admin: Add new recipe
    @PostMapping("/recipes")
    public Recipe addRecipe(@RequestBody Recipe recipe) {
        return recipeRepo.save(recipe);
    }

    // 🔹 Admin: Update recipe
    @PutMapping("/recipes/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe updated) {
        return recipeRepo.findById(id).map(recipe -> {
            recipe.setName(updated.getName());
            recipe.setShortDescription(updated.getShortDescription());
            recipe.setFullDescription(updated.getFullDescription());
            recipe.setImageUrl(updated.getImageUrl());
            recipe.setCategory(updated.getCategory());
            return ResponseEntity.ok(recipeRepo.save(recipe));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Admin: Delete recipe
    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        if (recipeRepo.existsById(id)) {
            recipeRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Admin: Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
