document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    { id: "popular-recipes", name: "Popular" },
    { id: "quick-recipes", name: "Quick & Easy" },
    { id: "healthy-recipes", name: "Healthy" }
  ];

  categories.forEach(cat => {
    fetchRecipes(cat.name, cat.id)  ;
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

  const favClass = recipe.isFavourite || recipe.favorited ? "favorited" : "";

  card.innerHTML = `
    <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-img" />
    <div class="recipe-info">
      <h3 class="recipe-title">${recipe.name}</h3>
      <p class="recipe-desc">${recipe.shortDescription}</p>
      <span class="fav-icon ${favClass}" data-recipe-id="${recipe.id}">
        <img src="/images/icons8-favorite-48.png" alt="Favorite" />
      </span>
    </div>
  `;

  // Open recipe modal on card click (excluding fav icon)
  card.addEventListener("click", (e) => {
    if (!e.target.closest(".fav-icon")) {
      showRecipeModal(recipe);
    }
  });

  // Favorite icon logic
  const favIcon = card.querySelector(".fav-icon");
  favIcon.addEventListener("click", async (e) => {
    e.stopPropagation(); // Prevent modal opening

    const icon = favIcon;
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

// Show full recipe modal// Show full recipe modal
function showRecipeModal(recipe) {
  let modal = document.getElementById("recipe-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "recipe-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">✕</button>
        <img src="" alt="Recipe Image" class="modal-img"/>
        <h2></h2>
        <pre></pre>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Update modal content
  const imgEl = modal.querySelector(".modal-img");
  const titleEl = modal.querySelector("h2");
  const descEl = modal.querySelector("pre");

  if (imgEl && titleEl && descEl) {
    imgEl.src = recipe.imageUrl;
    titleEl.textContent = recipe.name;
    descEl.textContent = recipe.fullDescription;
  } else {
    console.error("Modal inner elements not found.");
  }

  modal.style.display = "flex";
  document.body.classList.add("blur-background");

  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("blur-background");
  });
}

// Update padding for sticky nav
function updateMainPadding() {
  const navbar = document.querySelector('.navbar');
  const subNav = document.querySelector('.sub-nav');
  const main = document.querySelector('main');

  if (navbar && subNav && main) {
    const navbarHeight = navbar.offsetHeight;
    const subNavHeight = subNav.offsetHeight;
    subNav.style.top = navbarHeight + 'px';
    main.style.paddingTop = (navbarHeight + subNavHeight) + 'px';
  }
}

window.addEventListener("DOMContentLoaded", updateMainPadding);
window.addEventListener("resize", updateMainPadding);
