// 🚀 Verificação de autenticação antes de carregar a página
const token = localStorage.getItem("token");
console.log("🔍 Token no localStorage:", token);

if (!token) {
    console.error("❌ Usuário não autenticado! Redirecionando...");
    window.location.href = "index.html";
} else {
    console.log("✅ Usuário autenticado, carregando página...");
}

// 🚀 URL do backend
const API_URL = "https://backend-goaq.onrender.com"; 

function carregarReclamacoes() {
    fetch(`${API_URL}/api/opinioes`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        console.log("🔍 Status da resposta:", res.status);
        return res.json();
    })
    .then((reclamacoes) => {
        console.log("✅ Reclamações carregadas:", reclamacoes);

        const container = document.getElementById("listaReclamacoes");
        container.innerHTML = "";

        reclamacoes.slice().reverse().forEach((rec) => {
            const data = new Date(rec.data);
            const dataFormatada = data.toLocaleDateString("pt-BR");
            const horaFormatada = data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const div = document.createElement("div");
            div.className = "reclamacao";
            div.innerHTML = `
                <p><strong>Registrado em:</strong> ${dataFormatada} às ${horaFormatada}</p>
                <p><strong>Empresa Reclamada:</strong> ${rec.empresa}</p>
                <p><strong>Nome:</strong> ${rec.nome} | <strong>Email:</strong> ${rec.email}</p>
                <p><strong>Endereço:</strong> ${rec.logradouro}, Nº ${rec.numero}, Bairro: ${rec.bairro}, ${rec.cidade} - ${rec.uf}</p>
                <p><strong>Comentário:</strong> ${rec.comentario}</p>
                <button class="btn-excluir" onclick="excluirReclamacao('${rec._id}')">Excluir</button>
                <button class="editar-btn" data-id="${rec._id}">Editar</button>
                <hr/>
            `;
            container.appendChild(div);
        });

        // ✅ Adicionado verificação antes de chamar a função
        if (typeof adicionarEventosEdicao === "function") {
            adicionarEventosEdicao(reclamacoes);
        } else {
            console.warn("⚠️ Função adicionarEventosEdicao não encontrada.");
        }
    })
    .catch((error) => {
        console.error("❌ Erro ao carregar reclamações:", error);
        document.getElementById("listaReclamacoes").innerText = "Erro ao carregar reclamações.";
    });
}

// 🚀 Função de exclusão e edição seguem sem mudanças
// 🚀 Função para verificar se adicionarEventosEdicao() está definida

// 🚀 Inicia a página carregando as reclamações
window.onload = function () {
    document.getElementById("editarForm").style.display = "none";
    carregarReclamacoes();
};
