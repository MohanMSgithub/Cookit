package com.cookit.service;

import com.cookit.model.Favourite;
import com.cookit.model.Recipe;
import com.cookit.model.User;
import com.cookit.repository.FavouriteRepository;
import com.cookit.repository.RecipeRepository;
import com.cookit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class FavouriteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private FavouriteRepository favouriteRepository;

    public boolean addToFavourites(Long recipeId, Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return false;
        }

        String email;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            return false;
        }

        User user = userRepository.findByemail(email);
        Recipe recipe = recipeRepository.findById(recipeId).orElse(null);

        if (recipe == null || user == null) return false;

        if (favouriteRepository.existsByUserAndRecipe(user, recipe)) return false;

        Favourite fav = new Favourite();
        fav.setUser(user);
        fav.setRecipe(recipe);
        favouriteRepository.save(fav);
        return true;
    }
}
