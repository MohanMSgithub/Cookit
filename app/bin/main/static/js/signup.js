const errorDiv = document.getElementById("errorMessage");

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.style.display = "none";
}

document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearError();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!name || !email || !phone || !password || !confirmPassword) {
    showError("Please fill in all fields.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    showError("Phone number must be 10 digits.");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match.");
    return;
  }

  const user = {
    name,
    email,
    phoneNumber: phone,
    password
  };

  try {
    const response = await fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const message = await response.text();

    if (response.ok && message === "Signup successful!") {
      window.location.href = "login.html";
    } else {
      showError("Signup failed: " + message);
    }
  } catch (error) {
    console.error("Signup error:", error);
    showError("Server error. Try again later.");
  }
});
