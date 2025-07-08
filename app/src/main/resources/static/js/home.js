document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    { id: "popular-recipes", name: "Popular" },
    { id: "quick-recipes", name: "Quick & Easy" },
    { id: "healthy-recipes", name: "Healthy" }
  ];

  categories.forEach(cat => {
    fetchRecipes(cat.name, cat.id);
  });

  // 🔥 Add "View All" modal logic here
  document.querySelectorAll(".view-all").forEach(button => {
    button.addEventListener("click", async () => {
      const section = button.closest("section");
      const title = section.querySelector("h2")?.textContent;
      const containerId = section.querySelector(".recipe-row")?.id;

      if (!containerId) return;

      const modal = document.getElementById("viewAll-modal");
      const modalTitle = document.getElementById("viewAllTitle");
      const modalContainer = document.getElementById("viewAllContainer");

      modalTitle.textContent = title || "Recipes";
      modalContainer.innerHTML = "";

      try {
        const res = await fetch(`/api/recipes?category=${encodeURIComponent(title)}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        data.forEach(recipe => {
          const card = createRecipeCard(recipe);
          modalContainer.appendChild(card);
        });

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.classList.add("overflow-hidden");

      } catch (err) {
        console.error("View All modal error:", err);
      }
    });
  });

  // ❌ Don't forget the close button listener
  const closeBtn = document.getElementById("closeViewAll");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const modal = document.getElementById("viewAll-modal");
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    });
  }

  // 🔍 Search bar enter key handler
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchRecipes();
      }
    });
  }

  // 🧹 Close search modal
  const searchClose = document.getElementById("closeSearchModal");
  if (searchClose) {
    searchClose.addEventListener("click", () => {
      document.getElementById("search-results-section").classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    });
  }

  // 🧱 Update nav padding
  updateMainPadding();
  window.addEventListener("resize", updateMainPadding);
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
    <div class="relative h-full">
      <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-img h-48 w-full object-cover rounded-t-xl" />
      <div class="recipe-info p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
        <h3 class="recipe-title text-lg font-semibold mb-1">${recipe.name}</h3>
        <p class="recipe-desc text-sm text-gray-600 line-clamp-2">${recipe.shortDescription}</p>
        <span class="fav-icon absolute top-2 right-2 ${favClass}" data-recipe-id="${recipe.id}">
          <img src="/images/icons8-favorite-48.png" alt="Favorite" class="w-6 h-6" />
        </span>
      </div>
    </div>
  `;


  // Open recipe modal on card click (excluding fav icon)
  card.addEventListener("click", (e) => {
    if (!e.target.closest(".fav-icon")) {
      showRecipeModal(recipe);
    }
  });

  /// Favorite icon logic
const favIcon = card.querySelector(".fav-icon");
favIcon.addEventListener("click", async (e) => {
  e.stopPropagation(); // Prevent modal opening

  const icon = favIcon;
  const recipeId = icon.dataset.recipeId;
  const isFavorited = icon.classList.contains("favorited");

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to use this feature.");
    return;
  }

  try {
    const response = await fetch(`/api/favourites/${recipeId}`, {
      method: isFavorited ? "DELETE" : "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
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

// Show full recipe modal
function showRecipeModal(recipe) {
  let modal = document.getElementById("recipe-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "recipe-modal";
    modal.className = `
      fixed inset-0 z-50 hidden items-center justify-center 
      bg-black/60 backdrop-blur-sm
    `;

    modal.innerHTML = `
      <div class="relative bg-white rounded-xl p-6 max-w-2xl w-[90%] max-h-[80vh] overflow-y-auto shadow-xl">
        <button class="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-black modal-close">✕</button>
        <img src="" alt="Recipe Image" class="w-full h-60 object-cover rounded-md mb-4 modal-img" />
        <h2 class="text-2xl font-semibold mb-2"></h2>
        <pre class="whitespace-pre-wrap text-gray-700"></pre>
      </div>
    `;

    const root = document.getElementById("modal-root") || document.body;
    root.appendChild(modal);
  }

  // Update modal content
  const imgEl = modal.querySelector(".modal-img");
  const titleEl = modal.querySelector("h2");
  const descEl = modal.querySelector("pre");

  if (imgEl && titleEl && descEl) {
    imgEl.src = recipe.imageUrl;
    titleEl.textContent = recipe.name;
    descEl.textContent = recipe.fullDescription;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");

  // Close button
  modal.querySelector(".modal-close").addEventListener("click", () => {
    closeModal(modal);
  });

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

function closeModal(modal) {
  modal.classList.remove("flex");
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
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

function searchRecipes() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    })
    .then(data => {
      const resultsSection = document.getElementById("search-results-section");
      const resultsContainer = document.getElementById("search-results");

      resultsContainer.innerHTML = '';

      if (data.length === 0) {
        resultsContainer.innerHTML = "<p>No recipes found.</p>";
      } else {
        data.forEach(recipe => {
          const card = createRecipeCard(recipe);  // Uses existing modal logic
          resultsContainer.appendChild(card);
        });
      }

      resultsSection.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");

    })
    .catch(err => {
      console.error("Search error:", err);
    });
}

document.getElementById("closeSearchModal").addEventListener("click", () => {
  document.getElementById("search-results-section").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

window.addEventListener("DOMContentLoaded", updateMainPadding);
window.addEventListener("resize", updateMainPadding);
