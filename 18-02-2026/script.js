const container = document.getElementById('pokemoncontainer');
const limit = 24;
let currentpage = 1;

//loading //
const loader = document.getElementById("loader");
function showLoader() {
    loader.classList.remove("hidden");
}
function hideLoader() {
    loader.classList.add("hidden");
}


// pagination added button prev,next whiel used current page as variable
const pagination = document.getElementById("pagination");
document.getElementById("nextBtn").addEventListener("click", () => {
    currentpage++;
    loadpokemon(currentpage);
});
document.getElementById('prevBtn').addEventListener("click", () => {
    if (currentpage > 1) {
        currentpage--;
        loadpokemon(currentpage);
    }
});


//suggestionbox
const suggestionbox = document.getElementById("suggestions");
const searchinput = document.getElementById("searchinput");

searchinput.addEventListener("input", async function () {
    const query = this.value.toLowerCase().trim();
    if (!query) {
        suggestionbox.classList.add('hidden');
        return;
    }
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data = await response.json();

        const filtered = data.results.filter(pokemon =>
            pokemon.name.includes(query)
        ).slice(0, 5);
        showsuggestions(filtered);
    } catch (error) {
        console.log("error fetching suggestions");
    }
});



//creating showsuggestions function

function showsuggestions(pokemonList) {
    suggestionbox.innerHTML = "";
    if (pokemonList.length === 0) {
        suggestionbox.classList.add("hidden");
        return;
    }
    pokemonList.forEach(pokemon => {
        const searchsuggestion = document.createElement("div");
        searchsuggestion.className = " p-2 hover:bg-gray-200 cursor-pointer";
        searchsuggestion.textContent = pokemon.name;

        searchsuggestion.addEventListener("click", () => {
            searchinput.value = pokemon.name;
            suggestionbox.classList.add("hidden");
            searchpokemon();
        });
        suggestionbox.appendChild(searchsuggestion);
    });
    suggestionbox.classList.remove("hidden");
}

document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.add("hidden");
    }
});

//function to load all 20 cards //
async function loadpokemon(page = 1) {
    showLoader();
    currentpage = page;
    window.history.pushState({}, "", `?page=${page}`)
    pagination.classList.remove("hidden");
    container.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
    container.innerHTML = 'Loading....';
    const offset = (page - 1) * limit;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        container.innerHTML = "";
        const pokemonDetails = await Promise.all(
            data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
        );
        pokemonDetails.forEach(pokedata => displaypokemon(pokedata));

    }
    catch (error) {
        container.innerHTML = "Error in Loading ........";
    }
    finally {
        hideLoader();
    }

}

//function to search pokemon//
async function searchpokemon() {
    showLoader();
    const input = document.getElementById('searchinput').value.toLowerCase();
    if (!input) {
        loadpokemon();
        return;
    }
    container.innerHTML = "Loading...";
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        const data = await response.json();
        showpokemondetails(data);
    } catch (error) {
        container.innerHTML = "Pokemon not found ";
    }
    finally {
        hideLoader();
    }
}

//function to display pokemon//
async function displaypokemon(data) {
    const card1 = document.createElement("div");
    card1.className = `
       bg-gray-200/80
    rounded-lg
    p-3
    shadow
    hover:scale-105
    transition
    text-center
    w-full
    `;
    card1.innerHTML = `
    <img src=" ${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="w-24 h-24 object-contain mx-auto"/>
    <h3> ${data.name.toUpperCase()}<h3/>
    <h4>${data.id}</h4>
    `;
    card1.addEventListener("click", () => {
        showLoader();
        window.history.pushState({}, " ", `?pokemon=${data.id}&page=${currentpage}`);
        showpokemondetails(data);
        hideLoader();
    });
    container.appendChild(card1);
}

//showdetails of poekmon
async function showpokemondetails(data) {
    pagination.classList.add('hidden');
    container.className = "flex justify-center items-center min-h-[60vh]";
    container.innerHTML = `
            <div class = "bg-gray-200 p-6 rounded-lg shadow-lg text-center w-80 " >
                <h2>${data.name.toUpperCase()}</h2>
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="w-24 h-24 object-contain mx-auto""/>
                <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
                <p><strong>Height:</strong> ${data.height}</p>
                <p><strong>Weight:</strong> ${data.weight}</p>
                <p><strong>Base Experience:</strong> ${data.base_experience}</p>
                <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
                <button onclick="loadpokemon(currentpage)" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded 
           hover:bg-blue-600 transition"> Back</button>
            </div>
        `;
}

//router to make urlparamss query paramters//
function router() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    const pokemonId = params.get("pokemon");

    if (pokemonId) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json())
            .then(data => showpokemondetails(data));
    }
    else {
        loadpokemon(page);
    }
}
window.addEventListener("load", router);
window.addEventListener("popstate", router);