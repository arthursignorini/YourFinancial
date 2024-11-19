document.addEventListener('DOMContentLoaded', (event) => {
    atualizarGrafico();
});

function atualizarGrafico() {
    const mesSelecionado = document.getElementById("intervaloMes") ? document.getElementById("intervaloMes").value : "Mensal";
    const semanaSelecionada = document.getElementById("intervaloSemanal") ? document.getElementById("intervaloSemanal").value : "Semana";

    // Recuperar dados de ganhos e despesas do localStorage
    const totalGanhos = parseFloat(localStorage.getItem('totalGanhos')) || 0;
    const totalDespesas = parseFloat(localStorage.getItem('totalDespesas')) || 0;

    // Gerar dados fictícios para ganhos e despesas em um determinado mês e semana
    const dadosGanhos = Array(7).fill(totalGanhos / 7); // Dividir total de ganhos igualmente entre 7 dias
    const dadosDespesas = Array(7).fill(totalDespesas / 7); // Dividir total de despesas igualmente entre 7 dias

    // Atualizar o gráfico com os novos dados
    atualizarGraficoComDados(dadosGanhos, dadosDespesas, mesSelecionado, semanaSelecionada);
}

function atualizarGraficoComDados(dadosGanhos, dadosDespesas, mesSelecionado, semanaSelecionada) {
    // Limpar o gráfico existente, se houver
    d3.select("#grafico").select("svg").remove();

    // Configurações do gráfico
    const width = 1200;
    const height = 280;
    const minGraphHeight = 0; // Altura mínima para o gráfico
    const maxValue = 4000; // Valor máximo baseado nos dados
    const barWidth = width / 7; // Assumindo que há 7 dias em uma semana

    // Seleciona o elemento SVG onde o gráfico será desenhado
    const svg = d3.select("#grafico")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Escalas para eixo x e y
    const xScale = d3.scaleBand()
        .domain(d3.range(1, 8)) // Dias da semana
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([minGraphHeight, maxValue])
        .range([height, 0]);

    // Desenha as barras de ganhos
    svg.selectAll(".bar-ganhos")
        .data(dadosGanhos)
        .enter().append("rect")
        .attr("class", "bar-ganhos")
        .attr("x", (d, i) => xScale(i + 1))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - yScale(d))
        .attr("fill", "green");

    // Desenha as barras de despesas
    svg.selectAll(".bar-despesas")
        .data(dadosDespesas)
        .enter().append("rect")
        .attr("class", "bar-despesas")
        .attr("x", (d, i) => xScale(i + 1) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - yScale(d))
        .attr("fill", "red");

    // Adiciona eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    
}





//ELEMENTOS POPUP
var popup = document.getElementById("popup");

// Esconder a popup quando o documento for carregado
document.addEventListener("DOMContentLoaded", function() {
    popup.style.display = "none";
});

// Mostrar a popup quando o botão "Adicionar Meta" for clicado
document.getElementById("show-meta").addEventListener("click", function(e) {
    e.preventDefault();
    popup.style.display = "flex";
});

// Fechar a popup quando o botão de fechar for clicado
document.querySelector(".btn-fechar").addEventListener("click", function() {
    popup.style.display = "none";
});

// Função para adicionar uma nova meta
function addMeta(nome, valorMax, progresso = 0) {
    const metaDiv = document.createElement("div");
    metaDiv.className = "meta";
    metaDiv.style.display = "flex";
    metaDiv.style.flexDirection = "row-reverse";
    metaDiv.style.justifyContent = "flex-start";
    metaDiv.style.alignItems = "center";
    metaDiv.style.marginBottom = "10px";

    metaDiv.innerHTML = `
        <div class="meta-actions">
            <button class="add-saldo" style="
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #ccc;
                cursor: pointer;
                margin-left: 5px;
            ">Add Saldo</button>
            <button class="delete-meta" style="
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #ccc;
                cursor: pointer;
                margin-left: 5px;
            ">Deletar</button>
            <button class="edit-meta" style="
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #ccc;
                cursor: pointer;
                margin-left: 5px;
            ">Editar</button>
        </div>
        <span class="progress-percentage">${progresso}%</span>
        <progress value="${progresso}" max="${valorMax}" style="margin: 0 10px;"></progress>
        <label>${nome}</label>
    `;

    // Event listeners for edit, delete, and add saldo buttons
    metaDiv.querySelector(".edit-meta").addEventListener("click", () => {
        editMeta(metaDiv, nome, valorMax, progresso);
    });

    metaDiv.querySelector(".delete-meta").addEventListener("click", () => {
        metaDiv.remove();
    });

    metaDiv.querySelector(".add-saldo").addEventListener("click", () => {
        addSaldo(metaDiv);
    });

    document.querySelector(".barrasProgresso").appendChild(metaDiv);
}

// Função para editar uma meta existente
function editMeta(metaDiv, nome, valorMax, progresso) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const formMeta = document.getElementById("formMeta");

    // Set current values in the form
    document.getElementById("metaNome").value = nome;
    document.getElementById("metaValorMax").value = valorMax;

    // Show popup
    popup.style.display = "flex";
    popupTitle.textContent = "Editar Meta";

    // Update meta on form submit
    formMeta.onsubmit = function(event) {
        event.preventDefault();
        const newMetaNome = document.getElementById("metaNome").value;
        const newMetaValorMax = document.getElementById("metaValorMax").value;

        metaDiv.querySelector("label").textContent = newMetaNome;
        metaDiv.querySelector("progress").max = newMetaValorMax;

        popup.style.display = "none";
        formMeta.reset();
        formMeta.onsubmit = null;
        document.getElementById("popup-title").textContent = "Adicionar Meta";
    };
}

// Função para adicionar saldo a uma meta
function addSaldo(metaDiv) {
    const progress = metaDiv.querySelector("progress");
    const progressPercentage = metaDiv.querySelector(".progress-percentage");

    const saldo = prompt("Digite o valor a adicionar:");
    if (saldo !== null) {
        const novoProgresso = parseInt(progress.value) + parseInt(saldo);
        progress.value = novoProgresso;
        progressPercentage.textContent = `${((novoProgresso / progress.max) * 100).toFixed(2)}%`;
    }
}

// Capturar o evento de envio do formulário
document.getElementById("formMeta").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("metaNome").value;
    const valorMax = document.getElementById("metaValorMax").value;

    addMeta(nome, valorMax);

    // Fechar o popup e resetar o formulário
    popup.style.display = "none";
    e.target.reset();
});

// Atualizar a barra de progresso e a porcentagem ao carregar o documento
document.addEventListener("DOMContentLoaded", function() {
    const progressBars = document.querySelectorAll(".meta");
    progressBars.forEach(function(metaDiv) {
        const progress = metaDiv.querySelector("progress");
        const progressPercentage = metaDiv.querySelector(".progress-percentage");
        progressPercentage.textContent = `${progress.value}%`;
    });
});