document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const response = await fetch('https://cookit-e97n.onrender.com/api/users/do-login', {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: document.getElementById("emailOrPhone").value.trim(),
    password: document.getElementById("password").value.trim()
  }),
});

const data = await response.json();

if (response.ok && data.token && data.redirectUrl) {
  localStorage.setItem("token", data.token); // ✅ Save token
  window.location.href = data.redirectUrl;
} else {
  alert("Login failed: " + (data.error || "Unknown error"));
}

});
