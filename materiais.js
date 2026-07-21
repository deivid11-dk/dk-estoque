const btnSalvar = document.getElementById("btnSalvar");
const btnExcel = document.getElementById("btnExcel");
const lista = document.getElementById("listaMateriais");
const pesquisa = document.getElementById("pesquisa");

const nome = document.getElementById("nome");
const categoria = document.getElementById("categoria");
const quantidade = document.getElementById("quantidade");
const estoqueMinimo =
    document.getElementById("estoqueMinimo");


let materiais =
    JSON.parse(localStorage.getItem("materiais")) || [];

let indiceEdicao = null;


function salvarStorage() {

    localStorage.setItem(
        "materiais",
        JSON.stringify(materiais)
    );

}


function renderizar(listaMateriais = materiais) {

    lista.innerHTML = "";

    listaMateriais.forEach((material) => {

        const index =
            materiais.indexOf(material);

        const status =
            material.quantidade <= material.minimo
                ? "🔴 Baixo"
                : "🟢 Normal";

        lista.innerHTML += `
            <tr>

                <td>${material.nome}</td>

                <td>${material.categoria}</td>

                <td>${material.quantidade}</td>

                <td>${status}</td>

                <td>

                    <button onclick="editar(${index})">
                        ✏️
                    </button>

                    <button onclick="excluir(${index})">
                        🗑️
                    </button>

                </td>

            </tr>
        `;
    });

}


btnSalvar.addEventListener("click", () => {

    if (
        nome.value.trim() === "" ||
        categoria.value.trim() === "" ||
        quantidade.value === "" ||
        estoqueMinimo.value === ""
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const material = {

        nome:
            nome.value,

        categoria:
            categoria.value,

        quantidade:
            Number(
                quantidade.value
            ),

        minimo:
            Number(
                estoqueMinimo.value
            )

    };


    if (indiceEdicao !== null) {

        materiais[indiceEdicao] =
            material;

        indiceEdicao = null;

        btnSalvar.textContent =
            "Salvar Material";

    } else {

        materiais.push(material);

    }


    salvarStorage();

    renderizar();

    limparCampos();

});


function editar(index) {

    const material =
        materiais[index];

    nome.value =
        material.nome;

    categoria.value =
        material.categoria;

    quantidade.value =
        material.quantidade;


    estoqueMinimo.value =
        material.minimo;

    indiceEdicao = index;

    btnSalvar.textContent =
        "Atualizar Material";

}


function excluir(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este material?"
        );

    if (!confirmar)
        return;


    materiais.splice(
        index,
        1
    );

    salvarStorage();

    renderizar();

}


function limparCampos() {

    nome.value = "";

    categoria.value = "";

    quantidade.value = "";

    estoqueMinimo.value = "";

}


pesquisa.addEventListener("input", () => {

    const valor =
        pesquisa.value.toLowerCase();

    const filtrados =
        materiais.filter(material =>

            material.nome
                .toLowerCase()
                .includes(valor)

            ||

            material.categoria
                .toLowerCase()
                .includes(valor)

        );

    renderizar(
        filtrados
    );

});


window.editar = editar;
window.excluir = excluir;


if (btnExcel) {

    btnExcel.addEventListener(
        "click",
        exportarExcel
    );

}


function exportarExcel() {

    const dados =
        materiais.map(material => ({

            Material:
                material.nome,

            Categoria:
                material.categoria,

            Quantidade:
                material.quantidade,

            EstoqueMinimo:
                material.minimo

        }));


    const planilha =
        XLSX.utils.json_to_sheet(
            dados
        );

    const arquivo =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        arquivo,

        planilha,

        "Materiais"

    );


    XLSX.writeFile(

        arquivo,

        "DK_Estoque.xlsx"

    );

}


renderizar();