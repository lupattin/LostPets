import { Router } from "@vaadin/router";
import { state } from "../../state";
class Menupage extends HTMLElement {
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
    <header-comp type="Ingresado"></header-comp>
    <div class= "contenedor">
      <h1 class="title"> Bienvenido ${state.getState().name}</h1> 
      <button id="myData" class="button">Mis Datos</button>
      <button id="myPets" class="button">Mis Mascotas Reportadas</button>
      <button id="reportPet" class="button">Reportar Mascota</button>
      <button id="map" class="button">Mapa de Mascotas Reportadas</button>
    </div>
    `;
    style.innerHTML = `
        .contenedor{
          display:flex;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column;
          align-items: center;
          height: 80vh;
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
    const dataButton = this.shadow.getElementById("myData");
    const mapButton = this.shadow.getElementById("map");
    const reportPetButton = this.shadow.getElementById("reportPet");
    const myPetButton = this.shadow.getElementById("myPets");
    dataButton.addEventListener("click", ()=>{
      Router.go("datos-page")
    })
    reportPetButton.addEventListener("click", ()=>{
      Router.go("reportPet-page")
    })
    mapButton.addEventListener("click", ()=>{
      Router.go("map-pets-page")
    })
    myPetButton.addEventListener("click", ()=>{
      Router.go("pets-page")
    })
  }
}
customElements.define("menu-comp", Menupage);