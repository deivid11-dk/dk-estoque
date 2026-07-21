const dataAtual =
    document.getElementById("dataAtual");

if (dataAtual) {
    dataAtual.innerHTML =
        new Date().toLocaleDateString("pt-BR");
}


const materiais =
    JSON.parse(
        localStorage.getItem("materiais")
    ) || [];

const movimentacoes =
    JSON.parse(
        localStorage.getItem("movimentacoes")
    ) || [];


const totalMateriais =
    document.getElementById("totalMateriais");

const estoqueBaixo =
    document.getElementById("estoqueBaixo");

const totalMovimentacoes =
    document.getElementById("totalMovimentacoes");

const totalQuantidade =
    document.getElementById("totalQuantidade");


if (totalMateriais) {
    totalMateriais.textContent =
        materiais.length;
}


if (totalMovimentacoes) {
    totalMovimentacoes.textContent =
        movimentacoes.length;
}


if (estoqueBaixo) {

    const baixo =
        materiais.filter(material =>
            material.quantidade <= material.minimo
        );

    estoqueBaixo.textContent =
        baixo.length;
}


if (totalQuantidade) {

    const soma =
        materiais.reduce((total, material) => {

            return total +
                material.quantidade;

        }, 0);

    totalQuantidade.textContent =
        soma;
}

const listaMovimentacoes =
    document.getElementById(
        "listaMovimentacoes"
    );

if(listaMovimentacoes){

    listaMovimentacoes.innerHTML = "";

    const ultimas =
        [...movimentacoes]
            .reverse()
            .slice(0,5);

    if(ultimas.length === 0){

        listaMovimentacoes.innerHTML =
            "<p>Nenhuma movimentação encontrada.</p>";

    }else{

        ultimas.forEach(mov => {

            listaMovimentacoes.innerHTML += `
                <div class="mov-item">

                    <strong>
                        ${mov.material}
                    </strong>

                    <p>
                        ${mov.tipo.toUpperCase()}
                        - ${mov.quantidade}
                    </p>

                    <span>
                        ${mov.data}
                    </span>

                </div>
            `;
        });

    }

}

const canvas =
    document.getElementById(
        "graficoCategorias"
    );

if (canvas) {

    const categorias = {};

    materiais.forEach(material => {

        const categoria =
            material.categoria;

        if (categorias[categoria]) {

            categorias[categoria]++;

        } else {

            categorias[categoria] = 1;

        }

    });

    new Chart(canvas, {

        type: "doughnut",

        data: {

            labels:
                Object.keys(categorias),

            datasets: [{

                label: "Materiais",

                data:
                    Object.values(categorias),

                borderWidth: 2
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}

const canvasBaixo =
    document.getElementById(
        "graficoEstoqueBaixo"
    );

if (canvasBaixo) {

    const materiaisBaixos =
        materiais.filter(material =>
            material.quantidade <= material.minimo
        );

    new Chart(canvasBaixo, {

        type: "bar",

        data: {

            labels:
                materiaisBaixos.map(
                    material => material.nome
                ),

            datasets: [{

                label:
                    "Quantidade Atual",

                data:
                    materiaisBaixos.map(
                        material =>
                            material.quantidade
                    )

            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true
                }

            },

            plugins: {

                legend: {
                    display: true
                }

            }

        }

    });

}

const canvasMateriais =
    document.getElementById(
        "graficoMateriais"
    );

if (canvasMateriais) {

    new Chart(canvasMateriais, {

        type: "bar",

        data: {

            labels:
                materiais.map(
                    material => material.nome
                ),

            datasets: [{

                label:
                    "Quantidade em Estoque",

                data:
                    materiais.map(
                        material =>
                            material.quantidade
                    ),

                borderWidth: 1

            }]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            scales: {

                x: {

                    beginAtZero: true

                }

            }

        }

    });

}


const alertas =
    document.getElementById(
        "alertas"
    );

if(alertas){

    const materiaisBaixos =
        materiais.filter(material =>
            material.quantidade <= material.minimo
        );

    if(materiaisBaixos.length === 0){

        alertas.innerHTML = `
            <p>
                ✅ Nenhum material
                precisa de reposição.
            </p>
        `;

    }else{

        alertas.innerHTML = "";

        materiaisBaixos.forEach(material => {

            alertas.innerHTML += `

                <div class="alerta-item">

                    <h3>
                         ${material.nome}
                    </h3>

                    <p>

                        Quantidade atual:

                        ${material.quantidade}

                        ${material.unidade}

                    </p>

                    <p>

                        Estoque mínimo:

                        ${material.minimo}

                    </p>

                </div>

            `;
        });

    }

}