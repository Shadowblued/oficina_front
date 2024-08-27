
// Função para buscar dados da API e preencher a tabela
async function fetchData(URL, tableSelector, colunas) {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        
        const tableBody = document.querySelector(`${tableSelector} tbody`);
        
        // Limpa qualquer conteúdo existente no corpo da tabela
        tableBody.innerHTML = '';
        
        // Itera sobre os dados recebidos e cria as linhas da tabela
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Cria as células da linha com base nas colunas especificadas
            colunas.forEach(colunas => {
                const cell = document.createElement('td');
                cell.textContent = item[colunas] || 'N/A'; // Preenche com 'N/A' se o dado não existir
                row.appendChild(cell);
            });
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

// Exemplo de como chamar a função para diferentes páginas
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#cliente-table')) {
        // Endpoint específico para a página de usuários
        fetchData('http://18.188.56.142:8080/api/pessoas', '#clientes-table', ['id', 'nome', 'cpf', 'cidade', 'telefone']);
    }
});