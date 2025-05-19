document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // ✅ Substituímos localhost pela URL do backend no Render
    const API_URL = "https://backend-yv4g.onrender.com";

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    const messageBox = document.getElementById("loginMessage");

    messageBox.textContent = data.message;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 2000);

    // ✅ Armazena o token e redireciona corretamente
    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "moderador.html";
    }
});
