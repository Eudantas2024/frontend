document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // ✅ URL correta do backend no Render
    const API_URL = "https://backend-goaq.onrender.com/api/users";

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        // ✅ Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Falha na requisição`);
        }

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
            window.location.href = "/frontend/moderador.html";

        }
    } catch (error) {
        console.error("❌ Erro ao realizar login:", error);
        alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    }
});
