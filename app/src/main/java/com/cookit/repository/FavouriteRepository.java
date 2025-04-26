package com.cookit.repository;

import com.cookit.model.Favourite;
import com.cookit.model.Recipe;
import com.cookit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    boolean existsByUserAndRecipe(User user, Recipe recipe);
    List<Favourite> findAllByUser(User user);
}
