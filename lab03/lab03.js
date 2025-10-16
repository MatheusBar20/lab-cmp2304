//Aluno: Matheus Barbosa Silva
//Professor: Daniel Corrêa
//Disciplina: Tecnologia Construção de Software
//Data: 16/10/2025

const alunos = [];
let alunoEditando = null;
class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = notaFinal;
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }
}

// Seletores do DOM
const formAluno = document.getElementById('form-aluno');
const tabelaAlunosBody = document.getElementById('tabela-body');
const relatoriosDiv = document.getElementById('relatorios-resultado');

formAluno.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const curso = document.getElementById('curso').value;
    const notaFinal = parseFloat(document.getElementById('notaFinal').value);

    if (alunoEditando !== null) {
        // Lógica de edição
        alunos[alunoEditando].nome = nome;
        alunos[alunoEditando].idade = idade;
        alunos[alunoEditando].curso = curso;
        alunos[alunoEditando].notaFinal = notaFinal;
        alunoEditando = null;
        document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
        alert('Aluno editado com sucesso!');
    } else {
        // Lógica de cadastro
        const novoAluno = new Aluno(nome, idade, curso, notaFinal);
        alunos.push(novoAluno);
        alert('Aluno cadastrado com sucesso!');
    }

    renderizarTabela();
    formAluno.reset();
});

// Função para renderizar a tabela
const renderizarTabela = () => {
    tabelaAlunosBody.innerHTML = '';
    alunos.forEach((aluno, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.notaFinal}</td>
            <td>
                <button onclick="editarAluno(${index})">Editar</button>
                <button onclick="excluirAluno(${index})">Excluir</button>
            </td>
        `;
        tabelaAlunosBody.appendChild(linha);
    });
};

// Funções para editar e excluir
window.editarAluno = (index) => {
    alunoEditando = index;
    const aluno = alunos[index];
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('idade').value = aluno.idade;
    document.getElementById('curso').value = aluno.curso;
    document.getElementById('notaFinal').value = aluno.notaFinal;

    document.querySelector('button[type="submit"]').textContent = 'Salvar Edição';
};

window.excluirAluno = (index) => {
    if (confirm(`Tem certeza que deseja excluir o aluno ${alunos[index].nome}?`)) {
        alunos.splice(index, 1);
        alert('Aluno excluído!');
        renderizarTabela();
    }
};

// Funções de relatório
const listarAprovados = () => {
    const aprovados = alunos.filter(aluno => aluno.isAprovado());
    relatoriosDiv.innerHTML = `<h3>Alunos Aprovados:</h3><ul>${aprovados.map(a => `<li>${a.nome}</li>`).join('')}</ul>`;
};

const mostrarMediaNotas = () => {
    const somaNotas = alunos.reduce((soma, aluno) => soma + aluno.notaFinal, 0);
    const media = alunos.length > 0 ? (somaNotas / alunos.length).toFixed(2) : 0;
    relatoriosDiv.innerHTML = `<h3>Média das Notas:</h3><p>${media}</p>`;
};

const mostrarMediaIdades = () => {
    const somaIdades = alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
    const media = alunos.length > 0 ? (somaIdades / alunos.length).toFixed(2) : 0;
    relatoriosDiv.innerHTML = `<h3>Média das Idades:</h3><p>${media}</p>`;
};

const listarNomesAlfabetica = () => {
    const nomesOrdenados = alunos.map(aluno => aluno.nome).sort();
    relatoriosDiv.innerHTML = `<h3>Nomes em Ordem Alfabética:</h3><ul>${nomesOrdenados.map(nome => `<li>${nome}</li>`).join('')}</ul>`;
};

const mostrarAlunosPorCurso = () => {
    const contagem = alunos.reduce((acc, aluno) => {
        acc[aluno.curso] = (acc[aluno.curso] || 0) + 1;
        return acc;
    }, {});

    let resultado = '<h3>Quantidade de Alunos por Curso:</h3><ul>';
    for (const curso in contagem) {
        resultado += `<li>${curso}: ${contagem[curso]}</li>`;
    }
    resultado += '</ul>';
    relatoriosDiv.innerHTML = resultado;
};
renderizarTabela();