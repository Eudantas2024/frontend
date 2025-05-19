document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // ✅ Usando a URL do Render em vez de localhost
    const API_URL = "https://backend-goaq.onrender.com/api/users";
    fetch(`${API_URL}/register`, { ...});

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    const messageBox = document.getElementById("registerMessage");
    messageBox.textContent = data.message;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none"; // Oculta a mensagem após 2 segundos
    }, 2000);

    if (data.message.includes("Usuário registrado com sucesso")) {
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});
