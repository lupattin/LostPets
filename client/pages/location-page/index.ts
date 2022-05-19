import { Router } from "@vaadin/router";
import { state } from "../../state";
class Locationpage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");
    
    div.innerHTML = `
    <header-comp type="inicio"></header-comp>
    <div class= "contenedor">
      <h1 class="title"> Activar Ubicación</h1> 
      <p class="subtitle">Por favor, permitinos utilizar tu ubicación para poder utilizar la aplicación</p>
      <p class="subtitle">Haz click en el siguiente boton.</p>
      <button id="location" class="button">Activar</button>
    </div>
    `;
    style.innerHTML = `
        .contenedor{
          display:flex;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .title{
          font-family: 'Austie Bost Kitten Klub', sans-serif;
          font-size: 72px;  
        }
        .subtitle{
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
        }
        .button{
          width: 300px;
          height: 50px;
          background-color: red;
          border: solid black;
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
          color: #b6d7f8;
        }
    `;
    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    const loginButton = this.shadow.getElementById("location");
    loginButton.addEventListener("click", () => {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        var crd = pos.coords;
        
      
        state.saveCoordinates(crd.latitude, crd.longitude)
        Router.go("menu-page")
        
      };
      
      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      };
      
      navigator.geolocation.getCurrentPosition(success, error, options);
      
    });
  }
}
customElements.define("location-comp", Locationpage);