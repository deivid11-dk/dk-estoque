const selectMaterial =
    document.getElementById("material");

const listaMov =
    document.getElementById("listaMov");

const btn =
    document.getElementById("btnMovimentar");

let materiais =
    JSON.parse(localStorage.getItem("materiais")) || [];

let movimentacoes =
    JSON.parse(localStorage.getItem("movimentacoes")) || [];


function carregarMateriais(){

    materiais.forEach((item, index) => {

        selectMaterial.innerHTML += `
            <option value="${index}">
                ${item.nome}
            </option>
        `;
    });
}


function renderizarMov(){

    listaMov.innerHTML = "";

    [...movimentacoes]
        .reverse()
        .forEach((mov) => {

            const index =
                movimentacoes.indexOf(mov);

            listaMov.innerHTML += `
                <tr>

                    <td>${mov.data}</td>

                    <td>${mov.material}</td>

                    <td>${mov.tipo}</td>

                    <td>${mov.quantidade}</td>

                    

                    <td>

                        <button onclick="excluirMovimentacao(${index})">

                            🗑️

                        </button>

                    </td>

                </tr>
            `;

        });

}


btn.addEventListener("click", () => {

    const indice =
        selectMaterial.value;

    const tipo =
        document.getElementById("tipo").value;

    const qtd =
        Number(
            document.getElementById("quantidade").value
        );

   


    if(indice === "") return;

    if(tipo === "entrada"){
        materiais[indice].quantidade += qtd;
    }else{

        if(qtd > materiais[indice].quantidade){
            alert("Estoque insuficiente!");
            return;
        }

        materiais[indice].quantidade -= qtd;
    }


    const movimentacao = {

        data:
            new Date().toLocaleString("pt-BR"),

        material:
            materiais[indice].nome,

        tipo,

        quantidade:qtd,

        
    };


    movimentacoes.push(movimentacao);

    localStorage.setItem(
        "materiais",
        JSON.stringify(materiais)
    );

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    renderizarMov();

    alert("Movimentação registrada!");
});



function excluirMovimentacao(index){

    const confirmar = confirm(
        "Deseja realmente excluir esta movimentação?"
    );

    if(!confirmar) return;


    const mov =
        movimentacoes[index];


    const material =
        materiais.find(item =>
            item.nome === mov.material
        );


    if(material){

        if(mov.tipo === "entrada"){

            material.quantidade -= mov.quantidade;

        }else{

            material.quantidade += mov.quantidade;

        }

    }


    movimentacoes.splice(index,1);


    localStorage.setItem(
        "materiais",
        JSON.stringify(materiais)
    );

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );


    renderizarMov();

}



carregarMateriais();
renderizarMov();


window.excluirMovimentacao =
    excluirMovimentacao;