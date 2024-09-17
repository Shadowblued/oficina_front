
// Função para buscar dados da API e preencher a tabela
async function fetchData(URL, tableSelector, colunas, pageurl) {
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

                if (colunas === "marca") {
                    cell.textContent = item[colunas]?.nomeMarca || 'N/A'; // Exibe o nome da Marca
                } else if (colunas === 'cliente') {
                    cell.textContent = item[colunas]?.nome || 'N/A'; // Exibe o nome do cliente
                } else if (colunas === "veiculo") {
                    cell.textContent = item[colunas]?.descricao || "N/A"; // Exibe a descrição do veiculo
                } else if (colunas === "mecanico") {
                    cell.textContent = item[colunas]?.nome || "N/A";
                } else if (colunas === 'pecas') {
                    const pecasDescricao = item.pecas.map(peca => peca.descricao).join(', ');
                    cell.textContent = pecasDescricao || 'N/A'; // Exibe as descrições das peças
                } else if (colunas === 'servicos') {
                    const servicosDescricao = item.servicos.map(servico => servico.descricaoServico).join(', ');
                    cell.textContent = servicosDescricao || 'N/A'; // Exibe as descrições dos serviços
                } else {
                    cell.textContent = item[colunas] || 'N/A'; // Preenche com 'N/A' se o dado não existir
                }
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
                // Redirecionar para uma página de atualização
                const urlParams = new URLSearchParams(item).toString();
                window.location.href = `${pageurl}?${urlParams}`;
            });

            // Botão de Deletar
            const deleteButton = document.createElement('button');
            if (tableSelector == '#os-table') {
                deleteButton.textContent = 'Fechar OS';
                deleteButton.className = 'btn btn-danger';
                deleteButton.value = item.id;
                deleteButton.addEventListener('click', async () => {
                    fecharOs(item, URL);

                });

            } else {
                deleteButton.textContent = 'Deletar';
                deleteButton.className = 'btn btn-danger';
                deleteButton.value = item.id;
                deleteButton.addEventListener('click', async () => {
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
                                fetchData(URL, tableSelector, colunas, pageurl);
                            }
                        } catch (error) {
                            console.error('Erro ao tentar deletar o item:', error);
                        }
                    }
                });
            }

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

// Função para configurar o formulário para envio de atualização (PUT)
function setupUpdateFormSubmission(formSelector, URL) {
    const form = document.querySelector(formSelector)

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Captura os dados do formulário
        const formData = new FormData(event.target);
        const formObject = {};

        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        const jsonString = JSON.stringify(formObject);

        // Envio do JSON via fetch para atualizar o item
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonString
        })
            .then(response => response.json())
            .then(data => {
                console.log('Item atualizado com sucesso:', data);
                alert('Atualização registrada!');
            })
            .catch(error => {
                console.error('Erro ao atualizar o item:', error);
            });
    });
}

//Função que envia um novo cadastro pela API
function setupFormSubmission(formSelector, URL) {
    const form = document.querySelector(formSelector);

    form.addEventListener('submit', function (event) {
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
                alert('Cadastro realizado com sucesso!');
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });
}

function populateForm(urlParams, formSelector) {
    const form = document.querySelector(`${formSelector}`);
    urlParams.forEach((value, key) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    });
}

async function setupFormSubmissionVeiculos(URL, formSelector) {
    const form = document.querySelector(formSelector);

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        const selectCliente = document.getElementById('cliente');

        data.forEach(item => {
            // Cria uma nova opção no select
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.nome;

            // Adiciona a opção ao select
            selectCliente.appendChild(option);
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Captura os dados do formulário
            const formData = new FormData(event.target);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Exibe o objeto no console para verificar se os dados foram capturados corretamente
            console.log("Dados capturados:", formObject);

            const dataToSend = {
                descricao: formObject.descricao,
                placa: formObject.placa,
                anoModelo: formObject.anoModelo,
                cliente: {
                    id: formObject.cliente
                }
            };

            // Verifica o JSON antes de enviar
            console.log("JSON a ser enviado:", JSON.stringify(dataToSend));

            URL = 'http://18.188.56.142:8080/api/veiculos';

            // Envio do JSON via fetch
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Sucesso:', data);
                    alert('Veículo cadastrada com sucesso!');
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        });
        alert('Veículo cadastrada com sucesso!');

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);

    }
}

async function setupFormUpdateVeiculos(URL, formSelector) {
    const form = document.querySelector(formSelector);

    try {
        const response = await fetch('http://18.188.56.142:8080/api/clientes', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        const selectCliente = document.getElementById('cliente');

        data.forEach(item => {
            // Cria uma nova opção no select
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.nome;

            // Adiciona a opção ao select
            selectCliente.appendChild(option);
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Captura os dados do formulário
            const formData = new FormData(event.target);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Exibe o objeto no console para verificar se os dados foram capturados corretamente
            console.log("Dados capturados:", formObject);

            const dataToSend = {
                descricao: formObject.descricao,
                placa: formObject.placa,
                anoModelo: formObject.anoModelo,
                cliente: {
                    id: formObject.cliente
                }
            };

            // Verifica o JSON antes de enviar
            console.log("JSON a ser enviado:", JSON.stringify(dataToSend));

            // Envio do JSON via fetch
            fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Sucesso:', data);
                    alert('Veículo atualizado com sucesso!');
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        });

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);

    }
}

async function setupFormSubmissionPecas(URL, formSelector) {
    const form = document.querySelector(formSelector);

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        const selectCliente = document.getElementById('marca');

        data.forEach(item => {
            // Cria uma nova opção no select
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.nomeMarca;

            // Adiciona a opção ao select
            selectCliente.appendChild(option);
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Captura os dados do formulário
            const formData = new FormData(event.target);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Exibe o objeto no console para verificar se os dados foram capturados corretamente
            console.log("Dados capturados:", formObject);

            const dataToSend = {
                descricao: formObject.descricao,
                preco: formObject.preco,
                marca: {
                    id: formObject.marca
                }
            };

            // Verifica o JSON antes de enviar
            console.log("JSON a ser enviado:", JSON.stringify(dataToSend));

            URL = 'http://18.188.56.142:8080/api/pecas';

            // Envio do JSON via fetch
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Sucesso:', data);
                    alert('Peça cadastrada com sucesso!');
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        });

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);

    }
}

async function setupFormUpdatePecas(URL, formSelector) {
    const form = document.querySelector(formSelector);

    try {
        const response = await fetch('http://18.188.56.142:8080/api/marca', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        const selectCliente = document.getElementById('marca');

        data.forEach(item => {
            // Cria uma nova opção no select
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.nomeMarca;

            // Adiciona a opção ao select
            selectCliente.appendChild(option);
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Captura os dados do formulário
            const formData = new FormData(event.target);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Exibe o objeto no console para verificar se os dados foram capturados corretamente
            console.log("Dados capturados:", formObject);

            const dataToSend = {
                descricao: formObject.descricao,
                preco: formObject.preco,
                marca: {
                    id: formObject.marca
                }
            };

            // Verifica o JSON antes de enviar
            console.log("JSON a ser enviado:", JSON.stringify(dataToSend));

            // Envio do JSON via fetch
            fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Sucesso:', data);
                    alert('Peça atualizada com sucesso!');
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        });

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);

    }
}

async function fecharOs(item, URL) {
    const enviarEmail = confirm('Deseja enviar e-mail para o cliente?');
    if (enviarEmail) {
        try {
            const emailResponse = await fetch(`http://18.188.56.142:8080/api/os/email/${item.id}`, {
                method: 'POST', // Método para enviar o e-mail
                headers: {
                    'Content-Type': 'application/json'
                }

            });
            if (emailResponse.ok) {
                console.log("Email enviado com sucesso");
            } else {
                console.log("Email não Enviado");
            }

        } catch (error) {
            console.log("Email não enviado: erro", error)
        }
    }
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    try {
        item.encerramentoOs = formattedDate;
        const response = await fetch(`${URL}/${item.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        const data = await response.json();
        console.log("OS fechada com sucesso:", data);

        fetchData('http://18.188.56.142:8080/api/os', '#os-table', ['id', 'numero_os', 'cliente', 'veiculo', 'servicos', 'pecas', 'mecanico', 'aberturaOs', 'encerramentoOs', 'valorTotal'], 'form_os.html');
    } catch (error) {
        console.error('Erro ao fechar a OS', error)
    }
}

/* Função para configurar a pesquisa
function setupSearch(formSelector, tableSelector, urlBase) {
    const form = document.querySelector(formSelector);

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        const searchValue = form.querySelector('input[type="search"]').value;
        const searchURL = `${urlBase}?CPF=${encodeURIComponent(searchValue)}`;
        console.log("URL enviado: ", searchURL);
    }
    );
    fetchData(urlBase, tableSelector, ['id', 'nome', 'cpf', 'telefone', 'cidade', 'endereco']);
}*/



// Exemplo de como chamar a função para diferentes páginas
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector("#cliente-table")) {
        fetchData('http://18.188.56.142:8080/api/clientes', '#cliente-table', ['id', 'nome', 'cpf', 'telefone', 'cidade', 'endereco'], 'form_cliente.html');
    }

    if (document.querySelector('#form-cliente')) {
        // Verifica se há um ID na URL para determinar se é uma atualização
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            const itemId = urlParams.get('id');
            populateForm(urlParams, '#form-cliente');
            const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanURL);
            setupUpdateFormSubmission('#form-cliente', `http://18.188.56.142:8080/api/clientes/${itemId}`);
        } else {
            setupFormSubmission('#form-cliente', 'http://18.188.56.142:8080/api/clientes');
        }
    }

    if (document.querySelector('#search-form')) {
        setupSearch("#search-form", "#cliente-table", "http://18.188.56.142:8080/api/clientes");
    }

    if (document.querySelector("#mecanico-table")) {
        fetchData('http://18.188.56.142:8080/api/mecanicos', '#mecanico-table', ['id', 'nome', 'cpf', 'telefone', 'cidade', 'endereco'], 'form_mecanico.html');
    }

    if (document.querySelector('#form-mecanico')) {
        // Verifica se há um ID na URL para determinar se é uma atualização
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            const itemId = urlParams.get('id');
            populateForm(urlParams, '#form-mecanico');
            const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanURL);
            setupUpdateFormSubmission('#form-mecanico', `http://18.188.56.142:8080/api/mecanicos/${itemId}`);
        } else {
            setupFormSubmission('#form-mecanico', 'http://18.188.56.142:8080/api/mecanicos');
        }
    }

    if (document.querySelector("#servico-table")) {
        fetchData('http://18.188.56.142:8080/api/servicos', '#servico-table', ['id', 'descricaoServico', 'valorServico'], 'form_serviço.html');
    }

    if (document.querySelector('#form-servico')) {
        // Verifica se há um ID na URL para determinar se é uma atualização
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            const itemId = urlParams.get('id');
            populateForm(urlParams, '#form-servico');
            const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanURL);
            setupUpdateFormSubmission('#form-servico', `http://18.188.56.142:8080/api/servicos/${itemId}`);
        } else {
            setupFormSubmission('#form-servico', 'http://18.188.56.142:8080/api/servicos');
        }
    }

    if (document.querySelector('#form-marca')) {
        fetchData('http://18.188.56.142:8080/api/marca', '', ['id', 'nomeMarca'], '')
        setupFormSubmission('#form-marca', 'http://18.188.56.142:8080/api/marca');
    }

    if (document.querySelector("#veiculo-table")) {
        fetchData('http://18.188.56.142:8080/api/veiculos', '#veiculo-table', ['id', 'cliente', 'descricao', 'placa', 'anoModelo'], 'form_veiculo.html');
    }

    if (document.querySelector("#form-veiculo")) {
        // Verifica se há um ID na URL para determinar se é uma atualização
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            const itemId = urlParams.get('id');
            populateForm(urlParams, '#form-veiculo');
            const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanURL);
            setupFormUpdateVeiculos(`http://18.188.56.142:8080/api/veiculos/${itemId}`, '#form-veiculo',);
        } else {
            setupFormSubmissionVeiculos('http://18.188.56.142:8080/api/clientes', '#form-veiculo');
        }
    }

    if (document.querySelector("#peca-table")) {
        fetchData('http://18.188.56.142:8080/api/pecas', '#peca-table', ['id', 'descricao', 'marca', 'preco'], 'form_peca.html');
    }

    if (document.querySelector("#form-peca")) {
        // Verifica se há um ID na URL para determinar se é uma atualização
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            const itemId = urlParams.get('id');
            populateForm(urlParams, '#form-peca');
            const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanURL);
            setupFormUpdatePecas(`http://18.188.56.142:8080/api/pecas/${itemId}`, '#form-peca',);
        } else {
            setupFormSubmissionPecas('http://18.188.56.142:8080/api/marca', '#form-peca');
        }
    }

    if (document.querySelector("#os-table")) {
        fetchData('http://18.188.56.142:8080/api/os', '#os-table', ['id', 'numero_os', 'cliente', 'veiculo', 'servicos', 'pecas', 'mecanico', 'aberturaOs', 'encerramentoOs', 'valorTotal'], 'form_os.html');
    }
});