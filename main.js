const API_URL = "https://thesimpsonsapi.com/api/characters";
let listaPersonajes = [];
let indiceActual = 0;
let entradaNumerica = "";
let temporizadorControl = null;

const imagenesSeguras = {
    "Homer Simpson": "https://pngimg.com/uploads/simpsons/simpsons_PNG44.png",
    "Marge Simpson": "https://upload.wikimedia.org/wikipedia/en/0/0b/Marge_Simpson.png",
    "Bart Simpson": "https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png",
    "Lisa Simpson": "https://upload.wikimedia.org/wikipedia/en/e/ec/Lisa_Simpson.png",
    "Maggie Simpson": "https://upload.wikimedia.org/wikipedia/en/9/9d/Maggie_Simpson.png",
    "Ned Flanders": "https://static.wikia.nocookie.net/p__/images/8/82/Ned_Flanders-0.png/revision/latest?cb=20160624203800&path-prefix=protagonist",
    "Moe Szyslak": "https://upload.wikimedia.org/wikipedia/en/8/80/Moe_Szyslak.png",
    "Seymour Skinner": "https://static.wikia.nocookie.net/p__/images/3/3a/Seymour_Skinner.png/revision/latest?cb=20200804144332&path-prefix=protagonist",
    "Charles Montgomery Burns": "https://static.wikia.nocookie.net/omniversal-battlefield/images/2/27/MontgomeryBurns.png/revision/latest?cb=20190605233136",
    "Krusty the Clown": "https://www.sideshow.com/cdn-cgi/image/quality=90,f=auto/https://www.sideshow.com/storage/product-images/910139/krusty-the-clown_the-simpsons_silo.png",
    "Apu Nahasapeemapetilon": "https://models.spriters-resource.com/media/preview_icons/319/321877.png?updated=1755505745",
    "Patty Bouvier": "https://static.wikia.nocookie.net/lossimpson/images/f/f8/Patty_Bouvier.png/revision/latest?cb=20090802231042&path-prefix=es",
    "Selma Bouvier": "https://static.wikia.nocookie.net/lossimpson/images/b/ba/Selma_Bouvier.png/revision/latest?cb=20110108123553&path-prefix=es",
    "Abe Simpson II": "https://static.wikia.nocookie.net/simpsons/images/c/c1/Abe_toreador_tapped_out.png/revision/latest?cb=20150808021430",
    "Edna Krabappel": "https://www.pngkey.com/png/full/136-1362787_swsb-character-fact-krabappel-simpsons-edna-krabappel.png",
    "Maude Flanders": "https://static.wikia.nocookie.net/simpsons/images/9/95/Maude_Flanders.png/revision/latest?cb=20171127151808",
    "Rod Flanders": "https://static.simpsonswiki.com/images/thumb/8/80/Rod_Flanders.png/120px-Rod_Flanders.png",
    "Todd Flanders": "https://static.simpsonswiki.com/images/thumb/1/18/Todd_Flanders.png/180px-Todd_Flanders.png",
    "Waylon Smithers, Jr.": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ38EXz4nAfJrB_ZpGJObqoqHGD5wHBFwBkWQ&s",
    "Gary Chalmers": "https://static.wikia.nocookie.net/lossimpson/images/9/96/225x421px-chalmers.png/revision/latest?cb=20150722142626&path-prefix=es",
};

const IMAGEN_RESPALDO = "https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson._png.png";

function msgTV(txt) {
    document.querySelector("#resultado").innerHTML = `<div class='intro-screen'><p>${txt}</p></div>`;
}

function armarCard(p, canal) {
    let nom = p.name || "Desconocido";
    // Corrección aquí: buscamos por nombre exacto en el objeto
    let img = imagenesSeguras[nom] || p.image || IMAGEN_RESPALDO;
    let ocu = p.occupation || "Desconocido";
    let htmlCanal = canal ? `<p style='font-size:0.9rem; color:#7c54bc;'>CANAL ${canal}</p><hr>` : "";

    return `<div class='character-card'>
                ${htmlCanal}
                <p><strong>${nom}</strong></p>
                <p style='font-size:1rem; color:#666;'>TRABAJO: ${ocu}</p>
                <img src='${img}' alt='${nom}' style='max-width:200px;'>
            </div>`;
}
function xhttpRequest(mostrarTodo) {
    msgTV("Sintonizando...");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL, true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            let respuesta = JSON.parse(xhr.responseText);
            
            // FUERZA LA CONVERSIÓN A ARRAY:
            // Si la respuesta es un objeto que tiene una propiedad (ej: 'results'), úsala.
            // Si es un array directo, úsalo. Si no es nada, devuelve un array vacío.
            listaPersonajes = Array.isArray(respuesta) ? respuesta : (respuesta.results || Object.values(respuesta));

            console.log("Datos recibidos:", listaPersonajes); // Esto te dirá qué hay en la consola

            if (mostrarTodo) {
                let html = listaPersonajes.map(p => armarCard(p)).join("");
                document.querySelector("#resultado").innerHTML = html;
            }
        }
    };
    xhr.send();
}

function apagarTV() {
    msgTV("TV APAGADA<br>Presiona ON para encender");
}

function cambiarCanal(dir) {
    if (listaPersonajes.length === 0) return;
    indiceActual = (indiceActual + dir + listaPersonajes.length) % listaPersonajes.length;
    document.querySelector("#resultado").innerHTML = armarCard(listaPersonajes[indiceActual], indiceActual + 1);
}

function elegirCanalNumerico(num) {
    entradaNumerica += num.toString();
    msgTV("SINTONIZANDO: " + entradaNumerica);
    clearTimeout(temporizadorControl);
    temporizadorControl = setTimeout(function() {
        let n = parseInt(entradaNumerica);
        entradaNumerica = "";
        if (n > 0 && n <= listaPersonajes.length) {
            indiceActual = n - 1;
            document.querySelector("#resultado").innerHTML = armarCard(listaPersonajes[indiceActual], n);
        } else {
            msgTV("CANAL NO ENCONTRADO");
        }
    }, 1000);
}

function buscarPersonaje(txt) {
    if (txt === "") return;
    let filtrados = listaPersonajes.filter(p => p.name.toLowerCase().includes(txt.toLowerCase()));
    document.querySelector("#resultado").innerHTML = filtrados.length > 0 ? filtrados.map(p => armarCard(p)).join("") : "No encontrado";
}