function xhttpRequest() {
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://thesimpsonsapi.com/api/characters";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            let response = JSON.parse(this.responseText);
            console.dir(response);
            response.results.forEach(personaje =>{
                html +=`<p>${personaje.name}</p>
                <img src="https://cdn.thesimpsonsapi.com/500${personaje.portrait_path}" alt="${personaje.name}">`;
            });
            respuesta.innerHTML = html;
        }
       
    }
    xhttp.open("GET" ,url);
    xhttp.send();
}


 
