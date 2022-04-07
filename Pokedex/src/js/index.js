/*
Quando clicar no pokemon da listagem temos que esconder o cartão do pokemon ABERTO e mostrar o cartão correspondete ao que foi selecionado na listagem.
Para isso vamos precisar trabalhar com dois elementos:
1- Listagem
2- Cartão do Pokemon

Precisamos criar duas variaveis no JS para trabalhar com os elementros da tela

Vamos precisar trabalhar com um evento de clique feito pelo usuário na listagem de pokemons.

- Remover a classe ABERTO só do cartão que está aberto
- Ao clicar em pokemon da listagem pegamos o ID desse pokemon para saber qual cartão mostrar
- Remover a classe ativo que marca o pokemon selecionado
- Adicionar a classe ativo no item da lista selecionado
*/

// Criar as variaveis
const listaSelecaoPokemons = document.querySelectorAll('.pokemon')
const pokemonsCard = document.querySelectorAll('.cartao-pokemon')

listaSelecaoPokemons.forEach(pokemon => {
    //Evento clique pelo usuario na listagem pokemon
    pokemon.addEventListener('click', () => {
        console.log(pokemon)
        //remover classe ABERTO apenas do cartão aberto
        const cartaoPokemonAberto = document.querySelector('.aberto')
        cartaoPokemonAberto.classList.remove('aberto')

        //ao clicar no pokemon da listagem pegar o id desse pokemon para saber qual cartao mostrar
        const idPokemonSelecionado = pokemon.attributes.id.value

        const idDoCartaoPokemonParaAbrir = 'cartao-' + idPokemonSelecionado
        const cartaoPokemonParaAbrir = document.getElementById(idDoCartaoPokemonParaAbrir)
        cartaoPokemonParaAbrir.classList.add('aberto')

        //remover a classe ativo que marca o pokemon selecionado
        const pokemonAtivoNaListagem = document.querySelector('.ativo')
        pokemonAtivoNaListagem.classList.remove('ativo')

        //adicionar a classe ativo no item da lista selecionado
        const pokemonSelecionadoNaListagem = document.getElementById(idPokemonSelecionado)
        pokemonSelecionadoNaListagem.classList.add('ativo')
        
    })
})