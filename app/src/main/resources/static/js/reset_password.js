document.getElementById("resetForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const newPassword = document.getElementById("newPassword").value;
    const token = new URLSearchParams(window.location.search).get("token");

    const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
    });

    const result = await response.text();
    document.getElementById("resetMsg").innerText = result;

    if (result.toLowerCase().includes("success")) {
        document.getElementById("resetMsg").style.color = "green";
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 3000);
    }
});
