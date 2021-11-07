const lista = document.getElementById('lista')

const apiUrl = 'http://localhost:3000/jogos'

// modo edicao e id edicao
let edicao = false
let idEdicao = 0

// pegar os dados que o usuario digita no input (Elementos)
let titulo = document.getElementById('titulo')
let imagem = document.getElementById('imagem')
let genero = document.getElementById('genero')
let nota = document.getElementById('nota')

const getJogos = async () => {
  const response = await fetch(apiUrl)
  const jogos = await response.json()

  console.log(jogos)

  jogos.map(jogo => {
    lista.insertAdjacentHTML(
      'beforeend',
      `
        <div class="col">
            <div class="card">
            <img src="${jogo.imagem}" class="card-img-top mt-3" alt="...">
            <div class="card-body">
                <h5 class="card-title">${jogo.titulo}</h5>
                <span class="badge bg-primary">${jogo.genero}</span>
                <p class="card-text">Nota ${jogo.nota}</p>
                <p class="card-text">${jogo.jogado}</p>
                <div>
                    <button class="btn btn-primary" onclick="editJogo('${jogo.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteJogo('${jogo.id}')">Excluir</button>
                </div>
            </div>
            </div>
        </div>
        `
    )
  })
}

// [POST] envia uma vaga para o backend para ser cadastrada

const submitForm = async event => {
  // previnir que o navegador atualiza a pagina por causa o evento de submit
  event.preventDefault()

  // Estamos construindo um objeto com os valores que estamos pegando no input.
  const jogo = {
    titulo: titulo.value,
    imagem: imagem.value,
    genero: genero.value,
    nota: nota.value,
    jogado: false
  }
  // é o objeto preenchido com os valores digitados no input

  if (edicao) {
    putJogo(jogo, idEdicao)
  } else {
    createJogo(jogo)
  }

  clearFields()
  lista.innerHTML = ''
}

const createJogo = async jogo => {
  // estou construindo a requisicao para ser enviada para o backend.
  const request = new Request(`${apiUrl}/add`, {
    method: 'POST',
    body: JSON.stringify(jogo),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
  const response = await fetch(request)

  const result = await response.json()
  // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
  alert(result.message)
  // vaga cadastrada com sucesso.
  getJogos()
}

const putJogo = async (jogo, id) => {
  // estou construindo a requisicao para ser enviada para o backend.
  const request = new Request(`${apiUrl}/edit/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jogo),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
  const response = await fetch(request)

  const result = await response.json()
  // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
  alert(result.message)
  edicao = false
  idEdicao = 0
  getJogos()
}

// [DELETE] funcao que exclui um vaga de acordo com o seu id
const deleteJogo = async id => {
  // construir a requiscao de delete
  const request = new Request(`${apiUrl}/delete/${id}`, {
    method: 'DELETE'
  })

  const response = await fetch(request)
  const result = await response.json()

  alert(result.message)

  lista.innerHTML = ''
  getJogos()
}

// [GET] /Vaga/{id} - funcao onde recebe um id via paramtero envia uma requisicao para o backend
// e retorna a vaga de acordo com esse id.
const getJogoById = async id => {
  const response = await fetch(`${apiUrl}/${id}`)
  return await response.json()
}

// ao clicar no botao editar
// ela vai preencher os campos dos inputs
// para montar o objeto para ser editado
const editJogo = async id => {
  // habilitando o modo de edicao e enviando o id para variavel global de edicao.
  edicao = true
  idEdicao = id

  //precismo buscar a informacao da vaga por id para popular os campos
  // salva os dados da vaga que vamos editar na variavel vaga.
  const jogo = await getJogoById(id)

  //preencher os campos de acordo com a vaga que vamos editar.
  titulo.value = jogo.titulo
  imagem.value = jogo.imagem
  genero.value = jogo.genero
  nota.value = jogo.nota
}

const clearFields = () => {
  titulo.value = ''
  imagem.value = ''
  genero.value = ''
  nota.value = ''
}

getJogos()
