const lista = document.getElementById('lista')

const apiUrl = 'http://localhost:3000/jogos';

// modo edicao e id edicao
let edicao = false;
let idEdicao = 0;

// pegar os dados que o usuario digita no input (Elementos)
let titulo = document.getElementById('titulo');
let empresa = document.getElementById('empresa');
let logo = document.getElementById('logo');
let salario = document.getElementById('salario');
let senioridade = document.getElementById('senioridade');
let descricao = document.getElementById('descricao');

const getJogos = async () => {
    const response = await fetch(apiUrl)
    const jogos = await response.json();

    console.log(jogos);

    jogos.map((jogo) => {
        lista.insertAdjacentHTML('beforeend', `
        <div class="col">
            <div class="card">
            <img src="${jogo.imagem}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${jogo.nome}</h5>
                <span class="badge bg-primary">${jogo.genero}</span>
                <p class="card-text">R$ ${jogo.nota}</p>
                <p class="card-text">${jogo.jogado}</p>
                <div>
                    <button class="btn btn-primary" onclick="editVaga('${jogo.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteVaga('${jogo.id}')">Excluir</button>
                </div>
            </div>
            </div>
        </div>
        `)
    })
}

// [POST] envia uma vaga para o backend para ser cadastrada

const submitForm = async (event) => {
    // previnir que o navegador atualiza a pagina por causa o evento de submit
    event.preventDefault();

    // Estamos construindo um objeto com os valores que estamos pegando no input.
    const vaga = {
        titulo: titulo.value,
        empresa: empresa.value,
        logo: logo.value,
        salario: parseFloat(salario.value),
        senioridade: senioridade.value,
        descricao: descricao.value
    }
    // é o objeto preenchido com os valores digitados no input

    if(edicao) {
        putVaga(vaga, idEdicao);
    } else {
        createVaga(vaga);
    }

    clearFields();
    lista.innerHTML = '';
}

const createVaga = async(vaga) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(vaga),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    // vaga cadastrada com sucesso.
    getVagas();

}

const putVaga = async(vaga, id) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(vaga),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    edicao = false;
    idEdicao = 0;
    getVagas();
}


// [DELETE] funcao que exclui um vaga de acordo com o seu id
const deleteVaga = async (id) => {
    // construir a requiscao de delete
    const request = new Request(`${apiUrl}/delete/${id}`, {
        method: 'DELETE'
    })

    const response = await fetch(request);
    const result = await response.json();

    alert(result.message);
    
    lista.innerHTML = '';
    getVagas();
}


// [GET] /Vaga/{id} - funcao onde recebe um id via paramtero envia uma requisicao para o backend
// e retorna a vaga de acordo com esse id.
const getVagaById = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}


// ao clicar no botao editar
// ela vai preencher os campos dos inputs
// para montar o objeto para ser editado
const editVaga = async (id) => {
    // habilitando o modo de edicao e enviando o id para variavel global de edicao.
    edicao = true;
    idEdicao = id;

    //precismo buscar a informacao da vaga por id para popular os campos
    // salva os dados da vaga que vamos editar na variavel vaga.
    const vaga = await getVagaById(id);

    //preencher os campos de acordo com a vaga que vamos editar.
    titulo.value = vaga.titulo;
    empresa.value =  vaga.empresa;
    logo.value = vaga.logo;
    salario.value = vaga.salario;
    senioridade.value = vaga.senioridade;
    descricao.value = vaga.descricao;
}


const clearFields = () => {
    titulo.value = '';
    empresa.value = '';
    logo.value = '';
    salario.value = '';
    senioridade.value = '';
    descricao.value = '';
}

getJogos();