const lista = document.getElementById('lista')

const apiUrl = 'http://localhost:3000/jogos'

let edicao = false
let idEdicao = 0

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
            <div class="card text-center">
            <img src="${jogo.imagem}" class="card-img-top mt-3" alt="...">
            <div class="card-body">
                <h5 class="card-title">${jogo.titulo}</h5>
                <div class="card-info">
                  <h5><span class="badge bg-dark m-3">${jogo.genero}</span></h5>
                  <h3 class="card-text m-3">Nota ${jogo.nota}</h3>
                </div>
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

// [POST]
const submitForm = async event => {

  event.preventDefault()

  const jogo = {
    titulo: titulo.value,
    imagem: imagem.value,
    genero: genero.value,
    nota: nota.value,
    jogado: false
  }

  if (edicao) {
    putJogo(jogo, idEdicao)
  } else {
    createJogo(jogo)
  }

  clearFields()
  lista.innerHTML = ''
}

const createJogo = async jogo => {
  const request = new Request(`${apiUrl}/add`, {
    method: 'POST',
    body: JSON.stringify(jogo),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  const response = await fetch(request)
  const result = await response.json()
  
  alert(result.message)
  getJogos()
}

// [PUT]
const putJogo = async (jogo, id) => {
  const request = new Request(`${apiUrl}/edit/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jogo),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  const response = await fetch(request)
  const result = await response.json()

  alert(result.message)
  edicao = false
  idEdicao = 0
  getJogos()
}

// [DELETE]
const deleteJogo = async id => {
  const request = new Request(`${apiUrl}/delete/${id}`, {
    method: 'DELETE'
  })

  const response = await fetch(request)
  const result = await response.json()

  alert(result.message)

  lista.innerHTML = ''
  getJogos()
}

// [GET / by id]
const getJogoById = async id => {
  const response = await fetch(`${apiUrl}/${id}`)
  return await response.json()
}

const editJogo = async id => {

  edicao = true
  idEdicao = id

  const jogo = await getJogoById(id)

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