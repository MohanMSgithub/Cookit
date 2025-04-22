// Dropdown menu toggle
document.querySelectorAll('.sub-nav .dropdown .nav-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    const dropdown = button.nextElementSibling;

    document.querySelectorAll('.sub-nav .dropdown-content').forEach(dc => {
      if (dc !== dropdown) dc.style.display = 'none';
    });

    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});

// Close dropdowns if click occurs outside
window.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.sub-nav .dropdown-content').forEach(dc => {
      dc.style.display = 'none';
    });
  }
});
