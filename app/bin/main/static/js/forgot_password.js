document.getElementById("forgotForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
  
    fetch("/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
    .then(res => {
      if (res.ok) {
        document.getElementById("message").innerText = "Reset link sent (if the email exists)";
      } else {
        document.getElementById("message").innerText = "Something went wrong.";
      }
    });
  });
  