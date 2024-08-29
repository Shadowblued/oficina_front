
// Função para buscar dados da API e preencher a tabela
async function fetchData(URL, tableSelector, colunas) {
    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        
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

            // Cria uma célula para os botões
            const actionCell = document.createElement('td');

            // Botão de Atualizar
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Atualizar';
            updateButton.className = 'btn btn-primary';
            updateButton.value = item.id;
            updateButton.addEventListener('click', () => {
                // Aqui você pode definir o que acontece quando o botão de atualizar é clicado
                console.log('Atualizar ID:', item.id);
                // Redirecionar para uma página de atualização ou abrir um modal, por exemplo
            });

            // Botão de Deletar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.className = 'btn btn-danger';
            deleteButton.value = item.id;
            deleteButton.addEventListener('click', async() => {
                // Aqui você pode definir o que acontece quando o botão de deletar é clicado
                const confirmed = confirm(`Deseja realmente deletar o item com ID ${item.id}?`);
                if (confirmed) {
                    try {
                        const deleteResponse = await fetch(`${URL}/${item.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (deleteResponse.ok) {
                            console.log(`Item com ID ${item.id} deletado com sucesso`);
                            
                            // Atualizar a tabela após deletar o item
                            fetchData(URL, tableSelector, colunas);
                        } else {
                            console.error('Erro ao deletar o item:', deleteResponse.statusText);
                        }
                    } catch (error) {
                        console.error('Erro ao tentar deletar o item:', error);
                    }
    }
            });

            // Adiciona os botões na célula
            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);

            // Adiciona a célula à linha
            row.appendChild(actionCell);
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

function setupFormSubmission(formSelector, URL) {
    const form = document.querySelector(formSelector);

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Captura os dados do formulário
        const formData = new FormData(event.target);
        const formObject = {};
        
        // Converte os dados do FormData em um objeto JSON
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Exibe o objeto no console para verificar se os dados foram capturados corretamente
        console.log("Dados capturados:", formObject);

        const jsonString = JSON.stringify(formObject);

        // Verifica o JSON antes de enviar
        console.log("JSON a ser enviado:", jsonString);

        // Envio do JSON via fetch
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonString
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
}

// Exemplo de como chamar a função para diferentes páginas
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector("#cliente-table")) {
        fetchData('http://18.188.56.142:8080/api/clientes', '#cliente-table', ['id', 'nome', 'cpf', 'telefone', 'cidade', 'endereco']);
    }

    if (document.querySelector('#form-cliente')) {
        // Configura o envio do formulário como JSON
        setupFormSubmission('#form-cliente', 'http://18.188.56.142:8080/api/clientes');
    }

    if (document.querySelector("#mecanico-table")) {
        fetchData('http://18.188.56.142:8080/api/mecanicos', '#mecanico-table', ['id', 'nome', 'cpf', 'telefone', 'cidade', 'endereco']);
    }

    if (document.querySelector('#form-mecanico')) {
        // Configura o envio do formulário como JSON
        setupFormSubmission('#form-mecanico', 'http://18.188.56.142:8080/api/mecanicos');
    }    
});