document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    { id: "popular-recipes", name: "Popular" },
    { id: "quick-recipes", name: "Quick & Easy" },
    { id: "healthy-recipes", name: "Healthy" }
  ];

  categories.forEach(cat => {
    fetchRecipes(cat.name, cat.id);
  });

  document.querySelectorAll(".view-all").forEach(button => {
    button.addEventListener("click", () => {
      const section = button.closest(".recipe-section");
      section.querySelector(".recipe-row").classList.add("view-all-active");
    });
  });
});

// Fetch and display recipes
function fetchRecipes(category, containerId) {
  fetch(`/api/recipes?category=${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(containerId);
      data.forEach(recipe => {
        const card = createRecipeCard(recipe);
        container.appendChild(card);
      });
    })
    .catch(err => console.error(`Failed to load ${category} recipes:`, err));
}

// Create a recipe card
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  const favClass = recipe.isFavourite ? "favorited" : "";

  card.innerHTML = `
    <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-img" />
    <div class="recipe-info">
      <h3 class="recipe-title">${recipe.name}</h3>
      <p class="recipe-desc">${recipe.shortDescription}</p>
      <span class="fav-icon ${favClass}" data-recipe-id="${recipe.id}">&#10084;</span>
    </div>
  `;

  // Open recipe modal on card click (but not on heart click)
  card.addEventListener("click", (e) => {
    if (!e.target.classList.contains("fav-icon")) {
      showRecipeModal(recipe);
    }
  });

  // Favourite button logic
  const favIcon = card.querySelector(".fav-icon");
  favIcon.addEventListener("click", async (e) => {
    e.stopPropagation();

    const recipeId = favIcon.dataset.recipeId;

    try {
      const response = await fetch(`/favourites/${recipeId}`, {
        method: 'POST'
      });

      if (response.ok) {
        favIcon.classList.add("animate-fav"); // trigger animation
        favIcon.classList.toggle("favorited");

        // Remove animation class after it completes (so we can replay it later)
        setTimeout(() => {
          favIcon.classList.remove("animate-fav");
        }, 500); // Match with animation duration
      } else {
        console.error("Failed to add to favourites");
      }
    } catch (err) {
      console.error("Error adding to favourites:", err);
    }
  });

  return card;
}



// Show full recipe modal
function showRecipeModal(recipe) {
  let modal = document.getElementById("recipe-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "recipe-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">✕</button>
        <img src="${recipe.imageUrl}" alt="${recipe.name}" class="modal-img"/>
        <h2>${recipe.name}</h2>
        <p>${recipe.fullDescription}</p>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.querySelector(".modal-img").src = recipe.imageUrl;
    modal.querySelector("h2").textContent = recipe.name;
    modal.querySelector("p").textContent = recipe.fullDescription;
  }

  modal.style.display = "flex";
  document.body.classList.add("blur-background");

  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("blur-background");
  });
}
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  // Apply "favorited" class conditionally
  const favClass = recipe.favorited ? "favorited" : "";

  card.innerHTML = `
    <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-img" />
    <div class="recipe-info">
      <h3 class="recipe-title">${recipe.name}</h3>
      <p class="recipe-desc">${recipe.shortDescription}</p>
      <span class="fav-icon ${favClass}" data-recipe-id="${recipe.id}">❤️</span>
    </div>
  `;

  // Add click for full modal
  card.addEventListener("click", (e) => {
    if (!e.target.classList.contains("fav-icon")) {
      showRecipeModal(recipe);
    }
  });

  // Add click for fav icon
  card.querySelector(".fav-icon").addEventListener("click", async (e) => {
    e.stopPropagation(); // prevent modal open
    const icon = e.target;
    const recipeId = icon.dataset.recipeId;
    const isFavorited = icon.classList.contains("favorited");

    try {
      const response = await fetch(`/api/favourites/${recipeId}`, {
        method: isFavorited ? "DELETE" : "POST"
      });

      if (response.ok) {
        icon.classList.toggle("favorited");
        icon.classList.add("bounce");
        setTimeout(() => icon.classList.remove("bounce"), 500);
      } else {
        console.error("Favourite toggle failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });

  return card;
}

