let totalDespesas = parseFloat(localStorage.getItem('totalDespesas')) || 0;
let totalGanhos = parseFloat(localStorage.getItem('totalGanhos')) || 0;

document.addEventListener('DOMContentLoaded', (event) => {
    carregarContasPagasComoDespesas();
    atualizarResumoFinancas();
});

function carregarContasPagasComoDespesas() {
    let strDadosPagos = localStorage.getItem('contasPagas');
    let objDadosPagos = {};

    if (strDadosPagos) {
        objDadosPagos = JSON.parse(strDadosPagos);
    } else {
        objDadosPagos = { contasPagas: [] };
    }

    objDadosPagos.contasPagas.forEach(conta => {
        totalDespesas += parseFloat(conta.PRECO);
    });
}

function adicionarDespesa() {
    const categoria = document.getElementById('categoria-despesas').value;
    const valor = parseFloat(document.getElementById('valor-despesas').value);

    if (valor && valor > 0) {
        totalDespesas += valor;
        localStorage.setItem('totalDespesas', totalDespesas);
        alert(`Despesa de ${categoria} no valor de R$${valor} adicionada.`);
        atualizarResumoFinancas();
        document.getElementById('valor-despesas').value = '';
    } else {
        alert('Por favor, insira um valor válido.');
    }
}

function adicionarGanho() {
    const valor = parseFloat(document.getElementById('valor-ganhos').value);

    if (valor && valor > 0) {
        totalGanhos += valor;
        localStorage.setItem('totalGanhos', totalGanhos);
        alert(`Ganho de R$${valor} adicionado.`);
        atualizarResumoFinancas();
        document.getElementById('valor-ganhos').value = '';
    } else {
        alert('Por favor, insira um valor válido.');
    }
}

function atualizarResumoFinancas() {
    const lucroTotal = totalGanhos - totalDespesas;
    document.getElementById('total-despesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
    document.getElementById('total-ganhos').textContent = `R$ ${totalGanhos.toFixed(2)}`;
    document.getElementById('lucro-total').textContent = `R$ ${lucroTotal.toFixed(2)}`;
}

function sugerirMedidas() {
    const motivo = document.getElementById('motivo-texto').value;
    let sugestoes = '';

    if (motivo.toLowerCase().includes('alimentação')) {
        sugestoes += 'Tente fazer mais refeições em casa e evitar comer fora.\n';
    }
    if (motivo.toLowerCase().includes('transporte')) {
        sugestoes += 'Considere utilizar transporte público ou caronas para economizar.\n';
    }
    if (sugestoes === '') {
        sugestoes = 'Reveja seus gastos e veja onde pode cortar custos.';
    }

    document.getElementById('solucoes-texto').innerText = sugestoes;
}

document.getElementById('motivo-texto').addEventListener('input', sugerirMedidas);

document.getElementById('reset-financas').addEventListener('click', resetFinancas);

function resetFinancas() {
    totalDespesas = 0;
    totalGanhos = 0;

    // Resetar o valor das contas pagas
    let strDadosPagos = localStorage.getItem('contasPagas');
    let objDadosPagos = {};

    if (strDadosPagos) {
        objDadosPagos = JSON.parse(strDadosPagos);
        objDadosPagos.contasPagas.forEach(conta => {
            conta.PRECO = 0;
        });
        localStorage.setItem('contasPagas', JSON.stringify(objDadosPagos));
    }

    localStorage.setItem('totalDespesas', totalDespesas);
    localStorage.setItem('totalGanhos', totalGanhos);
    atualizarResumoFinancas();
    alert('Ganhos e despesas foram zerados.');
}
