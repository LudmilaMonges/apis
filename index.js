const API_URL = "https://thesimpsonsapi.com/api/characters";

let listaPersonajes = [];
let indiceActual = 0;

// Base de datos local con imágenes estables de Wikipedia/Fandom que cargan siempre
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
    "Apu Nahasapeemapetilon": "https://upload.wikimedia.org/wikipedia/en/7/7d/Apu_Nahasapeemapetilon.png",
    "Patty Bouvier": "https://static.wikia.nocookie.net/lossimpson/images/f/f8/Patty_Bouvier.png/revision/latest?cb=20090802231042&path-prefix=es",
    "Selma Bouvier": "https://static.wikia.nocookie.net/lossimpson/images/b/ba/Selma_Bouvier.png/revision/latest?cb=20110108123553&path-prefix=es",
    "Abe Simpson II": "https://static.wikia.nocookie.net/simpsons/images/c/c1/Abe_toreador_tapped_out.png/revision/latest?cb=20150808021430",
    "Edna Krabappel": "https://www.pngkey.com/png/full/136-1362787_swsb-character-fact-krabappel-simpsons-edna-krabappel.png",
    "Maude Flanders": "https://static.wikia.nocookie.net/simpsons/images/9/95/Maude_Flanders.png/revision/latest?cb=20171127151808",
    "Rod Flanders": "https://static.simpsonswiki.com/images/thumb/8/80/Rod_Flanders.png/120px-Rod_Flanders.png",
    "Todd Flanders": "https://static.simpsonswiki.com/images/thumb/1/18/Todd_Flanders.png/180px-Todd_Flanders.png",
    "Waylon Smithers, Jr.": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ38EXz4nAfJrB_ZpGJObqoqHGD5wHBFwBkWQ&s",
    "Apu Nahasapeemapetilon": "https://www.clipartmax.com/png/middle/45-450328_apu-nahasapeemapetilon-apu-nahasapeemapetilon.png",
    "Gary Chalmers": "https://static.wikia.nocookie.net/lossimpson/images/9/96/225x421px-chalmers.png/revision/latest?cb=20150722142626&path-prefix=es",

};

const IMAGEN_RESPALDO = "https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson._png.png";

function obtenerDatosPersonaje(p) {
    let nombre = p.name || "Desconocido";
    let ocupacion = p.occupation || "Desconocido";
    
    let imagenUrl = imagenesSeguras[nombre];
    if (!imagenUrl) {
        imagenUrl = IMAGEN_RESPALDO;
    }

    return { nombre, imagenUrl, ocupacion };
}

// Función principal (Botón ON)
async function xhttpRequest(mostrarTodo = true) {
    let respuesta = document.querySelector("#resultado");
    respuesta.innerHTML = "<div class='intro-screen'><p>Sintonizando...</p></div>";

    try {
        console.log("Conectando con la API...");
        let response = await fetch(API_URL);
        let data = await response.json();
        
        if (data.results && Array.isArray(data.results)) {
            listaPersonajes = data.results;
        } else if (Array.isArray(data)) {
            listaPersonajes = data;
        } else {
            listaPersonajes = [];
        }
        
        if (listaPersonajes.length === 0) {
            throw new Error("No se pudieron cargar los personajes.");
        }

        if (mostrarTodo) {
            let html = ""; 
            listaPersonajes.forEach(p => {
                let info = obtenerDatosPersonaje(p);
                // CORREGIDO: Eliminado el ternario roto info.info que causaba que no carguen
                html += `
                <div class="character-card">
                    <p>${info.nombre}</p>
                    <img src="${info.imagenUrl}" alt="${info.nombre}">
                </div>`;
            });
            respuesta.innerHTML = html;
        }
    } catch (error) {
        console.error("Error sintonizando:", error);
        respuesta.innerHTML = "<div class='intro-screen'><p>ERROR DE SEÑAL<br>Revisá la conexión</p></div>";
    }
}

// Función para apagar la TV (Botón OFF)
function apagarTV() {
    let respuesta = document.querySelector("#resultado");
    respuesta.innerHTML = `
        <div class="intro-screen">
            <p>TV APAGADA<br>Presiona ON para cargar todos<br>o CH+/CH- para pasar canales</p>
        </div>`;
}

// Renderiza un personaje individual en pantalla
function mostrarPersonajeIndividual(info, numeroCanal) {
    let respuesta = document.querySelector("#resultado");
    respuesta.innerHTML = `
    <div class="character-card">
        <p style="font-size: 0.9rem; color: #7c54bc; font-weight: bold;">CANAL ${numeroCanal}</p>
        <hr style="border: 1px solid #000; margin: 8px 0;">
        <p>${info.nombre}</p>
        <p style="font-size: 1rem; color: #666; margin-bottom: 10px;">Trabajo: ${info.ocupacion}</p>
        <img src="${info.imagenUrl}" alt="${info.nombre}">
    </div>`;
}

// Función para cambiar canales con CH+ y CH-
async function cambiarCanal(direccion) {
    if (listaPersonajes.length === 0) {
        await xhttpRequest(false);
    }
    
    if (listaPersonajes.length === 0) return;

    indiceActual += direccion;
    if (indiceActual >= listaPersonajes.length) indiceActual = 0;
    if (indiceActual < 0) indiceActual = listaPersonajes.length - 1;

    let personaje = listaPersonajes[indiceActual];
    let info = obtenerDatosPersonaje(personaje);
    mostrarPersonajeIndividual(info, indiceActual + 1);
}
let entradaNumerica = "";
let temporizadorControl = null;

async function elegirCanalNumerico(numero) {
    let respuesta = document.querySelector("#resultado");
    
    if (listaPersonajes.length === 0) {
        respuesta.innerHTML = "<div class='intro-screen'><p>Sintonizando...</p></div>";
        await xhttpRequest(false);
    }

    clearTimeout(temporizadorControl);
    
    // Concatenamos como texto primero para que el "0" sume (ej: "1" + "0" = "10")
    let intentoNuevaEntrada = entradaNumerica + numero.toString();
    
    // Evitamos combinaciones raras como "00" o "01"
    if (intentoNuevaEntrada === "00" || (intentoNuevaEntrada.startsWith("0") && intentoNuevaEntrada.length > 1)) {
        return; 
    }

    let valorIntento = parseInt(intentoNuevaEntrada);

    // Si la combinación se pasa de 20, la ignoramos por completo
    if (valorIntento > 20) {
        console.log("Combinación fuera de rango (Máximo 20):", valorIntento);
        if (entradaNumerica !== "") {
            activarTemporizadorSintonizacion();
        }
        return; 
    }

    // Guardamos la combinación válida en el búfer de texto
    entradaNumerica = intentoNuevaEntrada;
    
    // Mostramos en la pantalla el número que se va formando en tiempo real
    respuesta.innerHTML = `<div class='intro-screen'><p style='font-size: 3rem; color: #7c54bc; font-weight: bold;'>SINTONIZANDO:<br>CANAL ${entradaNumerica}</p></div>`;

    // Si ya metiste dos dígitos (como 10 o 20), cambia instantáneamente
    if (entradaNumerica.length === 2) {
        procesarSintonizacionDefinitiva();
    } else {
        // Si metiste un solo dígito (un 1 o un 2), espera un segundo por si querés agregar el 0
        activarTemporizadorSintonizacion();
    }
}

function activarTemporizadorSintonizacion() {
    temporizadorControl = setTimeout(() => {
        procesarSintonizacionDefinitiva();
    }, 1000);
}

// Procesa el cambio definitivo al canal y renderiza la tarjeta del personaje
function procesarSintonizacionDefinitiva() {
    let respuesta = document.querySelector("#resultado");
    let numeroCanal = parseInt(entradaNumerica);
    entradaNumerica = ""; // Limpiamos el búfer para la próxima sintonización

    // REGLA CORREGIDA: El filtro del 0 solo se aplica acá, al final de la combinación
    if (isNaN(numeroCanal) || numeroCanal === 0 || numeroCanal > 20) {
        respuesta.innerHTML = "<div class='intro-screen'><p>CANAL INVÁLIDO<br><span style='font-size: 1rem;'>Probá del 1 al 20</span></p></div>";
        return;
    }

    let indice = numeroCanal - 1;

    if (listaPersonajes[indice]) {
        indiceActual = indice; // Sincronizamos con los botones CH+ y CH-
        let personaje = listaPersonajes[indice];
        let info = obtenerDatosPersonaje(personaje);
        
        // Renderizamos usando tu función original de inyección estricta
        mostrarPersonajeIndividual(info, numeroCanal);
    } else {
        respuesta.innerHTML = `<div class='intro-screen'><p>CANAL ${numeroCanal}<br>SIN TRANSMISIÓN</p></div>`;
    }
}

function activarTemporizadorSintonizacion() {
    temporizadorControl = setTimeout(() => {
        procesarSintonizacionDefinitiva();
    }, 1000);
}

// Procesa el cambio definitivo al canal y renderiza la tarjeta del personaje con el título "CANAL X"
function procesarSintonizacionDefinitiva() {
    let respuesta = document.querySelector("#resultado");
    let numeroCanal = parseInt(entradaNumerica);
    entradaNumerica = ""; // Limpiamos el búfer para el próximo canal

    // Validamos que el canal no sea 0 solo, ni vacío, ni mayor a 20
    if (isNaN(numeroCanal) || numeroCanal === 0 || numeroCanal > 20) {
        respuesta.innerHTML = "<div class='intro-screen'><p>CANAL INVÁLIDO<br><span style='font-size: 1rem;'>Probá del 1 al 20</span></p></div>";
        return;
    }

    let indice = numeroCanal - 1;

    if (listaPersonajes[indice]) {
        indiceActual = indice; // Sincronizamos con los botones CH+ y CH-
        let personaje = listaPersonajes[indice];
        let info = obtenerDatosPersonaje(personaje);
        
        // Renderizamos la tarjeta final usando el número exacto del canal elegido
        mostrarPersonajeIndividual(info, numeroCanal);
    } else {
        respuesta.innerHTML = `<div class='intro-screen'><p>CANAL ${numeroCanal}<br>SIN TRANSMISIÓN</p></div>`;
    }
}

// Activa la espera de 1 segundo antes de cambiar de canal
function activarTemporizadorSintonizacion() {
    temporizadorControl = setTimeout(() => {
        procesarSintonizacionDefinitiva();
    }, 1000);
}

// Ejecuta el cambio definitivo al canal en la TV
function procesarSintonizacionDefinitiva() {
    let respuesta = document.querySelector("#resultado");
    let numeroCanal = parseInt(entradaNumerica);
    entradaNumerica = ""; // Limpiamos el búfer para el próximo canal

    // El canal 0 solo no existe en los personajes (van del 1 al 20)
    if (isNaN(numeroCanal) || numeroCanal === 0) {
        respuesta.innerHTML = "<div class='intro-screen'><p>CANAL INVÁLIDO<br><span style='font-size: 1rem;'>Probá del 1 al 20</span></p></div>";
        return;
    }

    let indice = numeroCanal - 1;

    if (listaPersonajes[indice]) {
        indiceActual = indice; // Sincroniza con los botones CH+ y CH-
        let personaje = listaPersonajes[indice];
        let info = obtenerDatosPersonaje(personaje);
        mostrarPersonajeIndividual(info, numeroCanal);
    } else {
        respuesta.innerHTML = `<div class='intro-screen'><p>CANAL ${numeroCanal}<br>SIN TRANSMISIÓN</p></div>`;
    }
}
// Función auxiliar para procesar el canal definitivo cuando el usuario deja de escribir
function activarTemporizadorSintonizacion() {
    let respuesta = document.querySelector("#resultado");
    
    temporizadorControl = setTimeout(() => {
        let numeroCanal = parseInt(entradaNumerica);
        entradaNumerica = ""; // Reseteamos el búfer para la próxima vez

        // El canal 0 solo no es válido (los personajes van del 1 al 20)
        if (isNaN(numeroCanal) || numeroCanal === 0) {
            respuesta.innerHTML = "<div class='intro-screen'><p>CANAL INVÁLIDO<br><span style='font-size: 1rem;'>Probá del 1 al 20</span></p></div>";
            return;
        }

        let indice = numeroCanal - 1;

        if (listaPersonajes[indice]) {
            indiceActual = indice; // Sincronizamos con CH+ y CH-
            let personaje = listaPersonajes[indice];
            let info = obtenerDatosPersonaje(personaje);
            mostrarPersonajeIndividual(info, numeroCanal);
        } else {
            respuesta.innerHTML = `<div class='intro-screen'><p>CANAL ${numeroCanal}<br>SIN TRANSMISIÓN</p></div>`;
        }
    }, 1000); // 1 segundo de espera
}