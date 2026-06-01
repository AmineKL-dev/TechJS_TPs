import inquirer from "inquirer";

const FetchDataPokemon = ()=>{
    const {pokemon} = inquirer.prompt([
        {
            type: "input",
            name: "pokemon",
            message: "Choose your pokemon",
            filter: (value)=> value.trim().toLowerCase(),
        }
    ])
    console.log(pokemon)
}

