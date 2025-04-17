document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const credentials = {
    email: document.getElementById("emailOrPhone").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  try {
    const response = await fetch("http://localhost:8080/api/users/do-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const message = await response.text();

    if (response.ok && message.includes(".html")) {
      // login successful, redirect
      window.location.href = message;
    } else {
      alert("Login failed: " + message);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Server error. Try again later.");
  }
});
