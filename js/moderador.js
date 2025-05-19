const API_URL = "https://backend-goaq.onrender.com"; 

// 🚀 Verificação de autenticação antes de carregar a página
const token = localStorage.getItem("token");
console.log("🔍 Token no localStorage:", token);

if (!token) {
    console.error("❌ Usuário não autenticado! Redirecionando...");
    window.location.href = "index.html";
} else {
    console.log("✅ Usuário autenticado, carregando página...");
}

function carregarReclamacoes() {
    fetch(`${API_URL}/api/opinioes`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((reclamacoes) => {
        console.log("✅ Reclamações carregadas:", reclamacoes);

        const container = document.getElementById("listaReclamacoes");
        container.innerHTML = "";

        reclamacoes.forEach((rec) => {
            const div = document.createElement("div");
            div.className = "reclamacao";
            div.innerHTML = `
                <p><strong>Registrado em:</strong> ${new Date(rec.data).toLocaleString()}</p>
                <p><strong>Empresa Reclamada:</strong> ${rec.empresa}</p>
                <p><strong>Nome:</strong> ${rec.nome} | <strong>Email:</strong> ${rec.email}</p>
                <p><strong>Comentário:</strong> ${rec.comentario}</p>
                <button class="btn-excluir" data-id="${rec._id}">Excluir</button>
                <button class="editar-btn" data-id="${rec._id}">Editar</button>
                <hr/>
            `;
            container.appendChild(div);
        });

        adicionarEventos();
    })
    .catch((error) => {
        console.error("❌ Erro ao carregar reclamações:", error);
        document.getElementById("listaReclamacoes").innerText = "Erro ao carregar reclamações.";
    });
}

// 🚀 Função para adicionar eventos nos botões Editar e Excluir
function adicionarEventos() {
    document.querySelectorAll(".editar-btn").forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            console.log(`🛠 Clique no botão Editar. ID: ${id}`); // ✅ Debug
            abrirFormularioEdicao(id);
        });
    });

    document.querySelectorAll(".btn-excluir").forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            excluirReclamacao(id);
        });
    });
}


// 🚀 Função para abrir o formulário de edição
function abrirFormularioEdicao(id) {
    console.log(`🔍 Tentando carregar reclamação ID: ${id}`); // ✅ Debug

    fetch(`${API_URL}/api/opinioes/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`❌ Erro ao buscar dados. Status: ${res.status}`);
        }
        return res.json();
    })
    .then((reclamacao) => {
        console.log("✅ Dados carregados:", reclamacao);

        document.getElementById("editNome").value = reclamacao.nome || "";
        document.getElementById("editEmail").value = reclamacao.email || "";
        document.getElementById("editEmpresa").value = reclamacao.empresa || "";
        document.getElementById("editLogradouro").value = reclamacao.logradouro || "";
        document.getElementById("editNumero").value = reclamacao.numero || "";
        document.getElementById("editBairro").value = reclamacao.bairro || "";
        document.getElementById("editComplemento").value = reclamacao.complemento || "";
        document.getElementById("editCidade").value = reclamacao.cidade || "";
        document.getElementById("editUf").value = reclamacao.uf || "";
        document.getElementById("editComentario").value = reclamacao.comentario || "";

        document.getElementById("salvarEdicao").setAttribute("data-id", id);
        document.getElementById("editarForm").style.display = "block";
    })
    .catch((error) => {
        console.error("❌ Erro ao carregar dados da reclamação:", error);
        alert("Erro ao carregar dados.");
    });
}


// 🚀 Função para excluir reclamação
function excluirReclamacao(id) {
    if (confirm("Tem certeza que deseja excluir esta reclamação?")) {
        fetch(`${API_URL}/api/opinioes/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            if (res.ok) {
                alert("Reclamação excluída.");
                carregarReclamacoes();
            } else {
                alert("Erro ao excluir.");
            }
        })
        .catch(() => alert("Erro de conexão."));
    }
}

// 🚀 Inicia a página carregando as reclamações
window.onload = function () {
    document.getElementById("editarForm").style.display = "none";
    carregarReclamacoes();
};
