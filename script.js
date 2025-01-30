let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

document.getElementById('form-venda').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const produto = document.getElementById('produto').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    
    if (!produto || isNaN(preco) || isNaN(quantidade)) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    const total = preco * quantidade;
    const venda = { produto, preco, quantidade, total, data: new Date() };
    vendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(vendas));

    atualizarTabela();
    atualizarResumo();
    atualizarGrafico();
});

function atualizarTabela() {
    const tbody = document.querySelector('#tabela-vendas tbody');
    tbody.innerHTML = '';
    
    vendas.forEach((venda, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venda.produto}</td>
            <td>R$ ${venda.preco.toFixed(2)}</td>
            <td>${venda.quantidade}</td>
            <td>R$ ${venda.total.toFixed(2)}</td>
            <td><button class="remover" onclick="removerVenda(${index})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });
}

function removerVenda(index) {
    vendas.splice(index, 1);
    localStorage.setItem('vendas', JSON.stringify(vendas));
    atualizarTabela();
    atualizarResumo();
    atualizarGrafico();
}

function atualizarResumo() {
    const faturamento = vendas.reduce((total, venda) => total + venda.total, 0);
    document.getElementById('faturamento').innerText = `R$ ${faturamento.toFixed(2)}`;
    
    const mediaMensal = 5000; // Exemplo de média
    const desempenho = faturamento > mediaMensal ? 'Acima da média' : faturamento < mediaMensal ? 'Abaixo da média' : 'Na média';
    document.getElementById('desempenho').innerText = desempenho;
}

function atualizarGrafico() {
    const labels = vendas.map(venda => `${venda.data.getDate()}/${venda.data.getMonth() + 1}`);
    const dados = vendas.map(venda => venda.total);

    const ctx = document.getElementById('grafico').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vendas Diárias',
                data: dados,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarTabela();
    atualizarResumo();
    atualizarGrafico();
});
