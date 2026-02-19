const container = document.getElementById('pokemoncontainer');
async function loadpokemon(){
    container.innerHTML = 'Loading....';

    try{
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        const data = await response.json();
        container.innerHTML = "";
        const pokemonDetails = await Promise.all(
            data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
        );
        pokemonDetails.forEach(pokedata => displaypokemon(pokedata));

    }
    catch(error) {
        container.innerHTML = "Error in Loading ........";
    }
}



async function searchpokemon() {

    const input = document.getElementById('searchinput').value.toLowerCase();
    if(!input){
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
}


async function displaypokemon(data) {
    const card1=document.createElement("div");
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
    card1.innerHTML=`
    <img src=" ${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="w-24 h-24 object-contain mx-auto"/>
    <h3> ${data.name.toUpperCase()}<h3/>
    `;
    card1.addEventListener("click",()=>{
        showpokemondetails(data);
    });
    container.appendChild(card1);  
    
}

async function showpokemondetails(data){
    container.className = "flex justify-center items-center min-h-[60vh]";
     container.innerHTML = `
            <div class = "bg-gray-200 p-6 rounded-lg shadow-lg text-center w-80 " >
                <h2>${data.name.toUpperCase()}</h2>
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="w-24 h-24 object-contain mx-auto""/>
                <p><strong>Type:</strong> ${data.types.map(t=>t.type.name).join(", ")}</p>
                <p><strong>Height:</strong> ${data.height}</p>
                <p><strong>Weight:</strong> ${data.weight}</p>
                <p><strong>Base Experience:</strong> ${data.base_experience}</p>
                <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
                <button onclick="loadpokemon()" > back</button>
            </div>
            
        `;

}
loadpokemon();