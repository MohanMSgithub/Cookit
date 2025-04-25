const API_URL = '/admin/recipes';

async function loadCategories() {
  const res = await fetch('/categories');
  const categories = await res.json();
  const dropdown = document.getElementById('category-select');
  dropdown.innerHTML = '';

  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.name;
    dropdown.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAllRecipes();
  loadCategories();
});

document.getElementById('recipe-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('recipe-id').value;

  const selectedCategories = Array.from(document.getElementById('category-select').selectedOptions)
                                  .map(opt => ({ id: parseInt(opt.value) }));

  const recipe = {
    name: document.getElementById('title').value,
    shortDescription: document.getElementById('description').value,
    fullDescription: document.getElementById('full-description').value,
    imageUrl: document.getElementById('imageUrl').value,
    categories: selectedCategories
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe)
  });

  resetForm();
  fetchAllRecipes();
});
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const categoryName = document.getElementById('new-category-name').value.trim();
    const status = document.getElementById('category-status');
  
    if (!categoryName) {
      status.textContent = "Category name cannot be empty.";
      return;
    }
  
    try {
      const res = await fetch('/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });
  
      if (res.ok) {
        status.textContent = "Category added successfully.";
        document.getElementById('category-form').reset();
        loadCategories(); // Refresh the dropdown
      } else {
        const err = await res.json();
        status.textContent = `Failed: ${err.message || 'Error adding category.'}`;
      }
    } catch (err) {
      status.textContent = `Error: ${err.message}`;
    }
  });
      