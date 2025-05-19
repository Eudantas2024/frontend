// 🚀 Carrega as reclamações e exibe na página
const API_URL = "https://backend-yv4g.onrender.com"; // ✅ URL do backend

function carregarReclamacoes() {
  fetch(`${API_URL}/api/opinioes`)
    .then((res) => res.json())
    .then((reclamacoes) => {
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

      adicionarEventosEdicao(reclamacoes);
    })
    .catch(() => {
      document.getElementById("listaReclamacoes").innerText = "Erro ao carregar reclamações.";
    });
}

// 🚀 Excluir reclamação via DELETE
function excluirReclamacao(id) {
  if (confirm("Tem certeza que deseja excluir esta reclamação?")) {
    fetch(`${API_URL}/api/opinioes/${id}`, { method: "DELETE" })
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

// 🚀 Salvar edição via PUT
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(atualizados),
  })
    .then((res) => {
      if (res.ok) {
        alert("Reclamação atualizada com sucesso.");
        carregarReclamacoes();
        fecharFormulario();
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
