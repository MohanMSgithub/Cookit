package com.cookit.repository;

import com.cookit.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.category.name) = LOWER(:category)")
    List<Recipe> findByCategoryNameIgnoreCase(@Param("category") String category);
    List<Recipe> findByNameContainingIgnoreCaseOrShortDescriptionContainingIgnoreCase(String name, String description);


}
