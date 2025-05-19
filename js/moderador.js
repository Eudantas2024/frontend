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

        adicionarEventosEdicao();
    })
    .catch((error) => {
        console.error("❌ Erro ao carregar reclamações:", error);
        document.getElementById("listaReclamacoes").innerText = "Erro ao carregar reclamações.";
    });
}

// 🚀 Função para adicionar eventos de edição nos botões Editar
function adicionarEventosEdicao() {
    document.querySelectorAll(".editar-btn").forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            abrirFormularioEdicao(id);
        });
    });
}

// 🚀 Função para abrir o formulário de edição
function abrirFormularioEdicao(id) {
    fetch(`${API_URL}/api/opinioes/${id}`)
        .then((res) => res.json())
        .then((reclamacao) => {
            document.getElementById("editNome").value = reclamacao.nome;
            document.getElementById("editEmail").value = reclamacao.email;
            document.getElementById("editEmpresa").value = reclamacao.empresa;
            document.getElementById("editLogradouro").value = reclamacao.logradouro;
            document.getElementById("editNumero").value = reclamacao.numero;
            document.getElementById("editBairro").value = reclamacao.bairro;
            document.getElementById("editComplemento").value = reclamacao.complemento;
            document.getElementById("editCidade").value = reclamacao.cidade;
            document.getElementById("editUf").value = reclamacao.uf;
            document.getElementById("editComentario").value = reclamacao.comentario;

            // ✅ Atualiza o botão de salvar edição com o ID correto
            document.getElementById("salvarEdicao").setAttribute("data-id", id);

            document.getElementById("editarForm").style.display = "block";
        })
        .catch((error) => {
            console.error("❌ Erro ao carregar dados da reclamação:", error);
            alert("Erro ao carregar dados.");
        });
}

// 🚀 Função para salvar edição via PUT
document.getElementById("salvarEdicao").addEventListener("click", function () {
    const id = this.getAttribute("data-id");

    const atualizados = {
        nome: document.getElementById("editNome").value,
        email: document.getElementById("editEmail").value,
        empresa: document.getElementById("editEmpresa").value,
        logradouro: document.getElementById("editLogradouro").value,
        numero: document.getElementById("editNumero").value,
        bairro: document.getElementById("editBairro").value,
        complemento: document.getElementById("editComplemento").value,
        cidade: document.getElementById("editCidade").value,
        uf: document.getElementById("editUf").value,
        comentario: document.getElementById("editComentario").value,
    };

    fetch(`${API_URL}/api/opinioes/${id}`, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(atualizados),
    })
    .then((res) => {
        if (res.ok) {
            alert("Reclamação atualizada com sucesso.");
            carregarReclamacoes();
            document.getElementById("editarForm").style.display = "none";
        } else {
            alert("Erro ao atualizar.");
        }
    })
    .catch(() => alert("Erro de conexão."));
});

// 🚀 Inicia a página carregando as reclamações
window.onload = function () {
    document.getElementById("editarForm").style.display = "none";
    carregarReclamacoes();
};
