const form = document.getElementById('form');
const contasDiv = document.getElementById('contas');
let contaEditando = null;

function leDados() {
    let strDados = localStorage.getItem('contas');
    let objDados = {};

    if (strDados) {
        objDados = JSON.parse(strDados);
    } else {
        objDados = { contas: [] };
    }

    return objDados;
}

function leDadosPagos() {
    let strDadosPagos = localStorage.getItem('contasPagas');
    let objDadosPagos = {};

    if (strDadosPagos) {
        objDadosPagos = JSON.parse(strDadosPagos);
    } else {
        objDadosPagos = { contasPagas: [] };
    }

    return objDadosPagos;
}

function salvaDados(dados) {
    localStorage.setItem('contas', JSON.stringify(dados));
}

function salvaDadosPagos(dadosPagos) {
    localStorage.setItem('contasPagas', JSON.stringify(dadosPagos));
}

function carregarContas() {
    let objDados = leDados();
    contas = objDados.contas;
    console.log('Contas carregadas com sucesso.');
    mostrarContas();
}

function salvarContas() {
    let objDados = { contas };
    salvaDados(objDados);
    console.log('Contas salvas com sucesso.');
}

function rolarParaOTopo() {
    window.scrollTo({ top: 80, behavior: 'smooth' });
}

function mostrarContas() {
    contas.sort((a, b) => new Date(a.VENCIMENTO) - new Date(b.VENCIMENTO));

    contasDiv.innerHTML = '';
    let linhaDiv;

    contas.forEach((conta, index) => {
        if (index % 1 === 0) {
            linhaDiv = document.createElement('div');
            linhaDiv.classList.add('linha');
            contasDiv.appendChild(linhaDiv);
        }

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <div class="card-body proxima-semana" data-dias-restantes="${calcularDiasRestantes(conta.VENCIMENTO)}">
                <h3><strong></strong> ${conta.TIPO}</h3>
                <p><strong>Vencimento:&nbsp&nbsp</strong> ${formatarData(conta.VENCIMENTO)}</p> <br>
                <p><strong>Preço:&nbsp&nbsp</strong> R$ ${conta.PRECO}</p> <br>
                <p class="descricao"><strong>Descrição:&nbsp&nbsp&nbsp</strong>${conta.DESCRICAO}</span></p> <br>
                <button class="editar-btn" data-id="${conta.ID}">Editar</button>
                <button class="pagar-btn" data-id="${conta.ID}">Pago</button> 
            </div>
        `;

        linhaDiv.appendChild(cardDiv);
    });

    const editarBtns = document.querySelectorAll('.editar-btn');
    editarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const conta = contas.find(c => c.ID === id);
            preencherFormulario(conta);
            contaEditando = conta;
            rolarParaOTopo();
        });
    });

    const pagarBtns = document.querySelectorAll('.pagar-btn');
    pagarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            pagarConta(id);
        });
    });
}

function calcularDiasRestantes(dataVencimento) {
    const vencimento = new Date(dataVencimento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diffTime = vencimento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function estaProximaSemana(data) {
    const umaSemanaEmMS = 7 * 24 * 60 * 60 * 1000;
    const hoje = new Date().getTime();
    const dataVencimento = new Date(data).getTime();
    return dataVencimento - hoje <= umaSemanaEmMS;
}

function pagarConta(id) {
    const contaIndex = contas.findIndex(conta => conta.ID === id);
    if (contaIndex !== -1) {
        const contaPaga = contas.splice(contaIndex, 1)[0];
        let objDadosPagos = leDadosPagos();
        objDadosPagos.contasPagas.push(contaPaga);
        salvaDadosPagos(objDadosPagos);
        salvarContas();
        mostrarContas();
        console.log('Conta paga com sucesso.');
    }
}

function preencherFormulario(conta) {
    document.getElementById('tipo').value = conta.TIPO;
    document.getElementById('vencimento').value = conta.VENCIMENTO;
    document.getElementById('preco').value = conta.PRECO;
    document.getElementById('descricao').value = conta.DESCRICAO;
}

function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const vencimentoInput = document.getElementById('vencimento');
    const preco = document.getElementById('preco').value;
    const descricao = document.getElementById('descricao').value;
    const vencimento = new Date(vencimentoInput.value);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (vencimento < hoje) {
        alert('A data de vencimento não pode ser uma data que já passou.');
        vencimentoInput.focus();
        return;
    }

    if (tipo.trim() === '' || preco.trim() === '' || descricao.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (contaEditando) {
        contaEditando.TIPO = tipo;
        contaEditando.VENCIMENTO = vencimentoInput.value;
        contaEditando.PRECO = preco;
        contaEditando.DESCRICAO = descricao;
        contaEditando = null;
    } else {
        contas.push({
            ID: contas.length + 1,
            TIPO: tipo,
            VENCIMENTO: vencimentoInput.value,
            PRECO: preco,
            DESCRICAO: descricao
        });
    }

    salvarContas();
    mostrarContas();
    form.reset();
});

carregarContas();
