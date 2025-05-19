document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recipeForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const recipe = {
      name: document.getElementById('name').value,
      shortDescription: document.getElementById('shortDescription').value,
      fullDescription: document.getElementById('fullDescription').value,
      imageUrl: document.getElementById('imageUrl').value
    };

    const categoryId = document.getElementById('categoryId').value;

    try {
      const response = await fetch(`/api/recipes?categoryId=${categoryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
      });

      if (response.ok) {
        alert("Recipe added successfully!");
        form.reset();
      } else {
        const err = await response.text();
        alert("Error: " + err);
      }
    } catch (error) {
      alert("Request failed: " + error.message);
    }
  });
});
