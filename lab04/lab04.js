//Aluno: Matheus Barbosa Silva
//Professor: Daniel Corrêa
//Disciplina: Tecnologia Construção de Software
//Data: 16/10/2025

// VARIÁVEIS GLOBAIS
const funcionarios = [];
let funcionarioEditando = null;

class Funcionario {
    constructor(id, nome, idade, cargo, salario) {
        this.id = id; 
        this.nome = nome;
        this.idade = idade;
        this.cargo = cargo;
        this.salario = salario;
    }

    setNome(novoNome) { this.nome = novoNome; }
    setIdade(novaIdade) { this.idade = novaIdade; }
    setCargo(novoCargo) { this.cargo = novoCargo; }
    setSalario(novoSalario) { this.salario = novoSalario; }
    toString() {
        return `ID: ${this.id}, Nome: ${this.nome}, Cargo: ${this.cargo}, Salário: R$ ${this.salario.toFixed(2)}`;
    }
}

const formFuncionario = document.getElementById('form-funcionario');
const tabelaFuncionariosBody = document.getElementById('tabela-body');
const relatoriosDiv = document.getElementById('relatorios-resultado');
const botaoCadastrar = formFuncionario.querySelector('button[type="submit"]');

formFuncionario.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const cargo = document.getElementById('cargo').value;
    const salario = parseFloat(document.getElementById('salario').value);

    if (funcionarioEditando !== null) {
        const func = funcionarios[funcionarioEditando];        
        func.setNome(nome);
        func.setIdade(idade);
        func.setCargo(cargo);
        func.setSalario(salario);
        
        funcionarioEditando = null;
        botaoCadastrar.textContent = 'Cadastrar';
        alert(`Funcionário ${nome} editado com sucesso!`);
    } else {
        const newId = funcionarios.length > 0 ? funcionarios[funcionarios.length - 1].id + 1 : 1;
        const novoFuncionario = new Funcionario(newId, nome, idade, cargo, salario);
        funcionarios.push(novoFuncionario);
        alert(`Funcionário ${nome} cadastrado com sucesso!`);
    }

    renderizarTabela();
    formFuncionario.reset();
});


const renderizarTabela = () => {
    tabelaFuncionariosBody.innerHTML = '';
    
    funcionarios.forEach(funcionario => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${funcionario.idade}</td>
            <td>${funcionario.cargo}</td>
            <td>R$ ${funcionario.salario.toFixed(2)}</td>
            <td>
                <button onclick="editarFuncionario(${funcionario.id})">Editar</button>
                <button onclick="excluirFuncionario(${funcionario.id})">Excluir</button>
            </td>
        `;
        tabelaFuncionariosBody.appendChild(linha);
    });
};


const buscarFuncionarioPorId = (id) => {
    return funcionarios.findIndex(f => f.id === id);
};

window.excluirFuncionario = (id) => {
    const index = buscarFuncionarioPorId(id);
    
    if (index !== -1) {
        const nomeFunc = funcionarios[index].nome;
        if (confirm(`Tem certeza que deseja excluir o funcionário ${nomeFunc}?`)) {
            funcionarios.splice(index, 1);
            alert(`Funcionário ${nomeFunc} excluído!`);
            renderizarTabela();
        }
    }
};

window.editarFuncionario = (id) => {
    const index = buscarFuncionarioPorId(id);

    if (index !== -1) {
        const funcionario = funcionarios[index];
        
        document.getElementById('nome').value = funcionario.nome;
        document.getElementById('idade').value = funcionario.idade;
        document.getElementById('cargo').value = funcionario.cargo;
        document.getElementById('salario').value = funcionario.salario;
        funcionarioEditando = index;
        botaoCadastrar.textContent = 'Salvar Edição';
    }
};
window.listarFuncionários = () => {
    const altosSalarios = funcionarios.filter(f => f.salario > 5000);    
    if (altosSalarios.length === 0) {
        relatoriosDiv.innerHTML = '<h3>Funcionários com Salário > R$ 5000:</h3><p>Nenhum funcionário encontrado.</p>';
        return;
    }    
    const listaHTML = altosSalarios.map(f => 
        `<li>${f.nome} (${f.cargo}) - R$ ${f.salario.toFixed(2)}</li>`
    ).join('');

    relatoriosDiv.innerHTML = `<h3>Funcionários com Salário > R$ 5000:</h3><ul>${listaHTML}</ul>`;
};

window.mostrarMediaSalarios = () => {
    const somaSalarios = funcionarios.reduce((total, f) => total + f.salario, 0);
    const media = funcionarios.length > 0 ? (somaSalarios / funcionarios.length).toFixed(2) : '0.00';
    
    relatoriosDiv.innerHTML = `<h3>Média Salarial:</h3><p>R$ ${media}</p>`;
};

window.listarCargos = () => {
    const todosCargos = funcionarios.map(f => f.cargo);
    const cargosUnicos = [...new Set(todosCargos)];
    
    if (cargosUnicos.length === 0) {
        relatoriosDiv.innerHTML = '<h3>Cargos Únicos:</h3><p>Nenhum cargo cadastrado.</p>';
        return;
    }

    const listaHTML = cargosUnicos.map(cargo => `<li>${cargo}</li>`).join('');
    relatoriosDiv.innerHTML = `<h3>Cargos Únicos:</h3><ul>${listaHTML}</ul>`;
};

window.listarNomesAlfabetica = () => {
    const nomesMaiusculosOrdenados = funcionarios
        .map(f => f.nome.toUpperCase())
        .sort();

    const listaHTML = nomesMaiusculosOrdenados.map(nome => `<li>${nome}</li>`).join('');
    
    relatoriosDiv.innerHTML = `<h3>Nomes em Maiúsculo e Ordenados:</h3><ul>${listaHTML}</ul>`;
};
renderizarTabela();