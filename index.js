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


// Función básica para armar el diseño de la tarjeta
function armarCard(p, canal) {
    let nom = p.name || p.character || "Desconocido";
    let img = p.image || p.imagenUrl || imagenesSeguras[nom] || IMAGEN_RESPALDO;
    let ocu = p.occupation || p.trabajo || "Desconocido";
   
    let htmlCanal = "";
    if (canal) {
        htmlCanal = "<p style='font-size:0.9rem; color:#7c54bc;'>CANAL " + canal + "</p><hr style='border:1px solid #000; margin:8px 0;'>";
    }


    return "<div class='character-card'>" +
                htmlCanal +
                "<p>" + nom + "</p>" +
                "<p style='font-size:1rem; color:#666; margin-bottom:10px;'>TRABAJO: " + ocu + "</p>" +
                "<img src='" + img + "' alt='" + nom + "'>" +
           "</div>";
}


// Cambiar el texto de la pantalla rápidamente
function msgTV(txt) {
    document.querySelector("#resultado").innerHTML = "<div class='intro-screen'><p>" + txt + "</p></div>";
}


function apagarTV() {
    msgTV("TV APAGADA<br>Presiona ON para cargar todos<br>o CH+/CH- para pasar canales");
}


// --- AJAX CLÁSICO ---
function xhttpRequest(mostrarTodo) {
    msgTV("Sintonizando...");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL, true);
   
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                let data = JSON.parse(xhr.responseText);
               
                if (data.results && Array.isArray(data.results)) {
                    listaPersonajes = data.results;
                } else if (Array.isArray(data)) {
                    listaPersonajes = data;
                } else {
                    listaPersonajes = [];
                }
               
                console.log("Array de personajes recibidos:", listaPersonajes);


                if (listaPersonajes.length === 0) {
                    msgTV("No hay personajes");
                    return;
                }


                if (mostrarTodo) {
                    let htmlFinal = "";
                    for (let i = 0; i < listaPersonajes.length; i++) {
                        htmlFinal += armarCard(listaPersonajes[i], null);
                    }
                    document.querySelector("#resultado").innerHTML = htmlFinal;
                }
            } catch (e) {
                msgTV("ERROR EN DATOS");
            }
        } else {
            msgTV("ERROR DE SEÑAL<br>Status: " + xhr.status);
        }
    };
    xhr.onerror = function() {
        msgTV("SIN CONEXIÓN");
    };
    xhr.send();
}


function cambiarCanal(dir) {
    if (listaPersonajes.length === 0) {
        xhttpRequest(false);
        setTimeout(function() {
            if (listaPersonajes.length > 0) cambiarCanal(dir);
        }, 500);
        return;
    }
   
    indiceActual = indiceActual + dir;
    if (indiceActual >= listaPersonajes.length) indiceActual = 0;
    if (indiceActual < 0) indiceActual = listaPersonajes.length - 1;
   
    document.querySelector("#resultado").innerHTML = armarCard(listaPersonajes[indiceActual], indiceActual + 1);
}


function elegirCanalNumerico(num) {
    if (listaPersonajes.length === 0) {
        xhttpRequest(false);
    }
    clearTimeout(temporizadorControl);
   
    let intento = entradaNumerica + num.toString();
    if (intento === "00" || (intento.indexOf("0") === 0 && intento.length > 1) || parseInt(intento) > 20) {
        if (entradaNumerica !== "" && parseInt(intento) > 20) {
            activarSinto();
        }
        return;
    }
   
    entradaNumerica = intento;
    msgTV("SINTONIZANDO:<br>CANAL " + entradaNumerica);
   
    if (entradaNumerica.length === 2) {
        procesarSinto();
    } else {
        activarSinto();
    }
}


function activarSinto() {
    temporizadorControl = setTimeout(procesarSinto, 1000);
}


function procesarSinto() {
    let num = parseInt(entradaNumerica);
    entradaNumerica = "";
   
    if (isNaN(num) || num === 0 || num > 20) {
        msgTV("CANAL INVÁLIDO<br><span style='font-size:1rem;'>Probá del 1 al 20</span>");
        return;
    }


    if (listaPersonajes[num - 1]) {
        indiceActual = num - 1;
        document.querySelector("#resultado").innerHTML = armarCard(listaPersonajes[indiceActual], num);
    } else {
        msgTV("CANAL " + num + "<br>SIN TRANSMISIÓN");
    }
}


function buscarPersonaje(txt) {
    if (listaPersonajes.length === 0) {
        xhttpRequest(false);
    }
    if (txt.trim() === "") {
        apagarTV();
        return;
    }


    let htmlFinal = "";
    let huboCoincidencia = false;


    for (let i = 0; i < listaPersonajes.length; i++) {
        let p = listaPersonajes[i];
        let nombre = p.name || p.character || "";
       
        if (nombre.toLowerCase().indexOf(txt.toLowerCase()) !== -1) {
            htmlFinal += armarCard(p, null);
            huboCoincidencia = true;
        }
    }


    if (huboCoincidencia === false) {
        msgTV("SIN SEÑAL<br><span style='font-size:1rem;'>No hay coincidencias</span>");
    } else {
        document.querySelector("#resultado").innerHTML = htmlFinal;
    }
}
