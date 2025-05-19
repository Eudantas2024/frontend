async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // ✅ Substituímos localhost pela URL do backend no Render
    const API_URL = "https://backend-goaq.onrender.com/";

    try {
        const response = await fetch(`${API_URL}/conteudo`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }

        const data = await response.json();
        document.getElementById("restrictedContent").style.display = "block"; // Exibe o conteúdo apenas após validação
    } catch (error) {
        console.error("Erro na autenticação:", error);
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
}

// ✅ Chama a função para verificar a autenticação
checkAuth();

function logout() {
    localStorage.removeItem("token");
    document.getElementById("logoutMessage").style.display = "block";

    setTimeout(() => {
        document.getElementById("logoutMessage").style.display = "none";
        window.location.href = "index.html";
    }, 2000);
}
