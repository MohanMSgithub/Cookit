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
  card.innerHTML = `
    <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-img" />
    <div class="recipe-info">
      <h3 class="recipe-title">${recipe.name}</h3>
      <p class="recipe-desc">${recipe.shortDescription}</p>
      <span class="fav-icon">❤️</span>
    </div>
  `;
  card.addEventListener("click", () => showRecipeModal(recipe));
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
