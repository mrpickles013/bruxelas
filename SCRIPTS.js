        const CHAVE_STORAGE = 'veiculos_crud_dados';
        let listaVeiculos = [];

        window.onload = function() {//iSSO DAQUI É TIPO QUANDO A TELA DO WINDOWS ERA CARREGADA (FORM.LOAD)
            carregarDados();
            atualizarTabela();
        };

        function carregarDados() {
            const dados = localStorage.getItem(CHAVE_STORAGE);
            if (dados) {
                listaVeiculos = JSON.parse(dados);
            } else {
                listaVeiculos = [
                    { id: '1', marca: 'Chevrolet', modelo: 'Onix', ano: 2020, chassi: '9BGKS48U0LG123456', peso: 1035 },
                    { id: '2', marca: 'Volkswagen', modelo: 'Gol', ano: 2015, chassi: '9BWCA44X1FP654321', peso: 980 }
                ];
                salvarStorage();
            }
        }

        function salvarStorage() {
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(listaVeiculos));
        }

        function atualizarTabela() {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            if (listaVeiculos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">Nenhum veículo cadastrado.</td></tr>';
                return;
            }

            listaVeiculos.forEach(veiculo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${escaparHTML(veiculo.marca)}</td>
                    <td>${escaparHTML(veiculo.modelo)}</td>
                    <td>${veiculo.ano}</td>
                    <td>${escaparHTML(veiculo.chassi)}</td>
                    <td>${veiculo.peso} kg</td>
                    <td>
                        <button type="button" class="btn-edit" onclick="editarVeiculo('${veiculo.id}')">Editar</button>
                        <button type="button" class="btn-delete" onclick="excluirVeiculo('${veiculo.id}')">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function salvarVeiculo(event) {
            event.preventDefault(); // É PARA TIRAR O PADRÃO DO FORM DE REINICIAR OS CAMPOS

            const id = document.getElementById('vehId').value;
            const marca = document.getElementById('marca').value.trim();
            const modelo = document.getElementById('modelo').value.trim();
            const ano = parseInt(document.getElementById('ano').value);
            const chassi = document.getElementById('chassi').value.trim().toUpperCase();
            const peso = parseFloat(document.getElementById('peso').value);

            if (id) {
                const index = listaVeiculos.findIndex(v => v.id === id);
                if (index !== -1) {
                    listaVeiculos[index] = { id, marca, modelo, ano, chassi, peso };//SALVAR EDIÇÃO
                }
            } 
            else {
                const novoVeiculo = {
                    id: Date.now().toString(),
                    marca,
                    modelo,
                    ano,
                    chassi,
                    peso
                };
                listaVeiculos.push(novoVeiculo);
            }

            salvarStorage();
            atualizarTabela();
        }

        function editarVeiculo(id) {
            const veiculo = listaVeiculos.find(v => v.id === id);
            if (!veiculo) return;// SE O VEÍCULO NÃO FOR ACHADO PELA LINHA ANTERIOR, VOCÊ RETORNA PARA TELA PRINCIPAL

            document.getElementById('vehId').value = veiculo.id;//CASO ELE SEJA ENCONTRADO VOCÊ PROSSEGUE COM O PREENCHIMENTJO NO FORM
            document.getElementById('marca').value = veiculo.marca;
            document.getElementById('modelo').value = veiculo.modelo;
            document.getElementById('ano').value = veiculo.ano;
            document.getElementById('chassi').value = veiculo.chassi;
            document.getElementById('peso').value = veiculo.peso;

            document.getElementById('form-title').innerText = 'Editar Veículo';
            document.getElementById('btnSubmit').innerText = 'Atualizar';
        }

        function excluirVeiculo(id) {
            if (confirm('Deseja realmente excluir este veículo?')) {
                listaVeiculos = listaVeiculos.filter(v => v.id !== id);
                salvarStorage();
                atualizarTabela();
            }
        }
        function escaparHTML(str) {//ESSE MÉTODO É PARA EVITAR ATAQUES DE CROSS SCRIPTING E AJUDA NO TRATAMENTO DE TAGS
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        }
 