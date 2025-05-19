document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // ✅ URL correta do backend no Render
    const API_URL = "https://backend-goaq.onrender.com/api/users/register";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        // ✅ Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            console.error(`❌ Erro ao registrar usuário. Status: ${response.status}`);
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // ✅ Mostra mensagem de sucesso
        const messageBox = document.getElementById("registerMessage");
        messageBox.textContent = data.message;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none"; // Oculta a mensagem após 2 segundos
        }, 2000);

        // ✅ Redireciona apenas se o cadastro for bem-sucedido
        if (data.message && data.message.includes("Usuário registrado com sucesso")) {
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }
    } catch (error) {
        console.error("❌ Erro ao registrar usuário:", error);
        alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    }
});
