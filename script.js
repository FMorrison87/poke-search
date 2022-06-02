const baseApi = 'https://pokeapi.co/api/v2'
const limit = '?limit='
const pokemon = '/pokemon/'

let pokeContainer = document.querySelector('.container__pokemon');
const pokeImageContainer = document.querySelector('.image__container')
const pokeImage = document.querySelector('.image__pokemon');
const pokeName = document.querySelector('.text__poke-name');
const button = document.querySelector('#search-button');
const randomButton = document.querySelector('#random-button');
const clearButton = document.querySelector('#clear-button');
const input = document.querySelector('input');
let isRandom = false;

const getSpecificPokeData = async (url) => {
    await fetch(url)
    .then(response => response.json())
    .then(
        data => {
            showPokemon(data)
        }
    );
}

const checkPokeData = (data) => {
    const inputValue = document.querySelector('input').value.toLowerCase();

    const randomValue = data.results[Math.floor(Math.random() * data.results.length)];

    if(isRandom === false) {
        data.results.forEach(result => {
            if(inputValue === result.name) {
                getSpecificPokeData(result.url)
            } else {
                showError();
            }
        });
    } else {
        getSpecificPokeData(randomValue.url);
    }
}

const clearPokeData = () => {
    pokeImageContainer.innerHTML = ''
    pokeName.innerHTML = ''
}

const clearInputData = () => {
    input.value = '';
}

const showError = () => {
    clearPokeData();
    pokeName.innerHTML += 'No Pokemon Found'
}

const disableButton = () => {
    button.disabled = 'disabled';
}

const enableButton = () => {
    button.disabled = '';
    if(button.classList.contains('disabled')) {
        button.classList.remove('disabled');
    }
}

const showPokemon = (data) => {
    clearPokeData();

    pokeImageContainer.innerHTML += `
    <img src="${data.sprites.front_default}" alt="pokemon" class="image__pokemon image__poke-sprite">
    `
    pokeName.innerHTML = data.name;
}

const getAllPokeData = async (url) => {
    await fetch(url)
    .then(response => response.json())
    .then(
        data => {
            checkPokeData(data)
        }
    );
}

const buildUrlWithCount = (data) => {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=';
    url += data.toString();
    getAllPokeData(url);
}

const getData = async () => {
    disableButton();

    try {
        await fetch(baseApi + pokemon)
        .then(response => response.json())
        .then(data => {
            buildUrlWithCount(data.count);
        });
    } catch(error) {
        console.log(error)
    } finally {
        setTimeout(() => {
            enableButton();
        }, 500)
    }
}

const handleKeyDown = (key) => {
    if (key.key === 'Enter') {
        getData();
    }
}

button.addEventListener('click', () => {
    if(!input.value) {
        return;
    }
    button.classList.add('disabled');
    getData();
    isRandom = false;
})
input.addEventListener('keydown', handleKeyDown)
clearButton.addEventListener('click', () => {
    clearPokeData();
    clearInputData();
    isRandom = false;
})
randomButton.addEventListener('click', () => {
    isRandom = true;
    getData();
})
