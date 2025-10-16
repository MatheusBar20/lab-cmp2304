// --- FUNÇÃO GLOBAL DE NAVEGAÇÃO ---
const links = [
    { nome: "Início", url: "index.html" },
    { nome: "Cadastrar Filme", url: "cadastro-filmes.html" },
    { nome: "Cadastrar Sala", url: "cadastro-salas.html" },
    { nome: "Cadastrar Sessão", url: "cadastro-sessoes.html" },
    { nome: "Venda de Ingressos", url: "venda-ingressos.html" },
    { nome: "Sessões Disponíveis", url: "sessoes.html" }
];

function carregarMenu() {
    const nav = document.getElementById('menu-navegacao');
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '10px';
    ul.style.backgroundColor = '#ccc';
    
    links.forEach(link => {
        const li = document.createElement('li');
        li.style.display = 'inline';
        li.style.marginRight = '15px';
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.nome;
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);
}

// --- FUNÇÕES GLOBAIS DE LOCALSTORAGE ---

function getDados(chave) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
}

function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

// --- CADASTRO DE FILMES (Chave: filmes) ---

function salvarFilme(event) {
    event.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const genero = document.getElementById('genero').value;
    const classificacao = document.getElementById('classificacao').value;
    const duracao = document.getElementById('duracao').value;
    const estreia = document.getElementById('estreia').value;

    const filmes = getDados('filmes');
    const novoFilme = { id: Date.now(), titulo, descricao, genero, classificacao, duracao, estreia };
    filmes.push(novoFilme);
    salvarDados('filmes', filmes);

    alert(`Filme "${titulo}" salvo com sucesso!`);
    document.getElementById('form-filme').reset();
}

// --- CADASTRO DE SALAS (Chave: salas) ---

function salvarSala(event) {
    event.preventDefault();
    const nomeSala = document.getElementById('nomeSala').value;
    const capacidade = document.getElementById('capacidade').value;
    const tipo = document.getElementById('tipo').value;

    const salas = getDados('salas');
    const novaSala = { id: Date.now(), nomeSala, capacidade, tipo };
    salas.push(novaSala);
    salvarDados('salas', salas);

    alert(`Sala "${nomeSala}" salva com sucesso!`);
    document.getElementById('form-sala').reset();
}

// --- CADASTRO DE SESSÕES (Chave: sessoes) ---

function carregarFilmesESalas() {
    const filmes = getDados('filmes');
    const salas = getDados('salas');

    const selectFilme = document.getElementById('filme');
    const selectSala = document.getElementById('sala');

    selectFilme.innerHTML = '<option value="">Selecione o Filme...</option>';
    filmes.forEach(filme => {
        const option = document.createElement('option');
        option.value = filme.id; // Armazena o ID
        option.textContent = filme.titulo;
        selectFilme.appendChild(option);
    });

    selectSala.innerHTML = '<option value="">Selecione a Sala...</option>';
    salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id; // Armazena o ID
        option.textContent = `${sala.nomeSala} (${sala.tipo}, ${sala.capacidade} lugares)`;
        selectSala.appendChild(option);
    });
}

function salvarSessao(event) {
    event.preventDefault();
    const filmeId = document.getElementById('filme').value;
    const salaId = document.getElementById('sala').value;
    const dataHora = document.getElementById('dataHora').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const idioma = document.getElementById('idioma').value;
    const formato = document.getElementById('formato').value;

    const sessoes = getDados('sessoes');
    const novaSessao = { id: Date.now(), filmeId, salaId, dataHora, preco, idioma, formato };
    sessoes.push(novaSessao);
    salvarDados('sessoes', sessoes);

    alert('Sessão salva com sucesso!');
    document.getElementById('form-sessao').reset();
}

// --- VENDA DE INGRESSOS (Chave: ingressos) ---

function popularSessoesVenda() {
    const sessoes = getDados('sessoes');
    const selectSessao = document.getElementById('sessao');
    const filmes = getDados('filmes');
    const salas = getDados('salas');
    
    selectSessao.innerHTML = '<option value="">Selecione a Sessão...</option>';

    // Se a página for carregada via redirecionamento com ID de sessão na URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessaoPreSelecionadaId = urlParams.get('sessaoId');

    sessoes.forEach(sessao => {
        // Encadeamento de dados (Exercício 4)
        const filme = filmes.find(f => f.id == sessao.filmeId);
        const sala = salas.find(s => s.id == sessao.salaId);
        
        const filmeTitulo = filme ? filme.titulo : 'Filme Desconhecido';
        const salaNome = sala ? sala.nomeSala : 'Sala Desconhecida';
        
        const option = document.createElement('option');
        option.value = sessao.id;
        option.textContent = `${filmeTitulo} - Sala: ${salaNome} - ${new Date(sessao.dataHora).toLocaleString()}`;
        
        if (sessaoPreSelecionadaId && sessao.id == sessaoPreSelecionadaId) {
            option.selected = true;
        }

        selectSessao.appendChild(option);
    });
}

function salvarVenda(event) {
    event.preventDefault();
    const sessaoId = document.getElementById('sessao').value;
    const cliente = document.getElementById('cliente').value;
    const cpf = document.getElementById('cpf').value;
    const assento = document.getElementById('assento').value;
    const pagamento = document.getElementById('pagamento').value;

    const ingressos = getDados('ingressos');
    const novaVenda = { id: Date.now(), sessaoId, cliente, cpf, assento, pagamento };
    ingressos.push(novaVenda);
    salvarDados('ingressos', ingressos);

    alert(`Venda de ingresso para a sessão ${sessaoId} confirmada para ${cliente}!`);
    document.getElementById('form-venda').reset();
}

// --- LISTAGEM DE SESSÕES (sessoes.html) ---
function listarSessoes() {
    const sessoes = getDados('sessoes');
    const filmes = getDados('filmes');
    const salas = getDados('salas');
    const container = document.getElementById('lista-sessoes'); // Seleciona o grid-container

    container.innerHTML = ''; // Limpa o conteúdo

    if (sessoes.length === 0) {
        container.innerHTML = '<p>Nenhuma sessão cadastrada.</p>';
        return;
    }

    sessoes.forEach(sessao => {
        const filme = filmes.find(f => f.id == sessao.filmeId);
        const sala = salas.find(s => s.id == sessao.salaId);

        const filmeTitulo = filme ? filme.titulo : 'Filme Desconhecido';
        const salaNome = sala ? sala.nomeSala : 'Sala Desconhecida';
        const dataFormatada = new Date(sessao.dataHora).toLocaleString();

        // Cria um novo card
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <h3>${filmeTitulo}</h3>
            <p><strong>Sala:</strong> ${salaNome} (${sessao.formato})</p>
            <p><strong>Idioma:</strong> ${sessao.idioma}</p>
            <p><strong>Quando:</strong> ${dataFormatada}</p>
            <p><strong>Preço:</strong> R$ ${sessao.preco.toFixed(2)}</p>
            <button onclick="comprarIngresso(${sessao.id})">Comprar Ingresso</button>
        `;
        container.appendChild(card);
    });
}
function comprarIngresso(sessaoId) {
    window.location.href = `venda-ingressos.html?sessaoId=${sessaoId}`;
}