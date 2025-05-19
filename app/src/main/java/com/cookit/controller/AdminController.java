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

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private RecipeRepository recipeRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    // 🔹 Admin: Get all recipes
    @GetMapping("/recipes")
    public List<Recipe> getAllRecipes() {
        return recipeRepo.findAll();
    }

    // 🔹 Admin: Add new recipe (with categoryId)
    @PostMapping("/recipes")
    public ResponseEntity<Recipe> addRecipe(
            @RequestBody Recipe recipe,
            @RequestParam Long categoryId
    ) {
        return categoryRepo.findById(categoryId).map(category -> {
            recipe.setCategory(category);
            Recipe saved = recipeRepo.save(recipe);
            return ResponseEntity.ok(saved); // ✅ This is fine
        }).orElse(ResponseEntity.badRequest().build()); // ✅ No message, but valid ResponseEntity<Recipe>
    }





    // 🔹 Admin: Update recipe
    @PutMapping("/recipes/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestBody Recipe updatedRecipe,
            @RequestParam(required = false) Long categoryId
    ) {
        return recipeRepo.findById(id).map(recipe -> {
            recipe.setName(updatedRecipe.getName());
            recipe.setShortDescription(updatedRecipe.getShortDescription());
            recipe.setFullDescription(updatedRecipe.getFullDescription());
            recipe.setImageUrl(updatedRecipe.getImageUrl());

            if (categoryId != null) {
                categoryRepo.findById(categoryId).ifPresent(recipe::setCategory);
            }

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
