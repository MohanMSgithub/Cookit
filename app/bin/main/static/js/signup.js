document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Client-side validation
  if (!name || !email || !phone || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be 10 digits.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
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
      alert("Signup Successful!");
      window.location.href = "login.html";
    } else {
      alert("Signup failed: " + message);
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Server error. Try again later.");
  }
});
