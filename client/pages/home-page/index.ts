import { Router } from "@vaadin/router";
import { state } from "../../state";
class Homepage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    if (localStorage.getItem("data")) {
      state.data = JSON.parse(localStorage.getItem("data"));

      Router.go("menu-page");
    }

    const div = document.createElement("div");
    const style = document.createElement("style");
    div.innerHTML = `
    <header-comp class="header" type="inicio"></header-comp>
    <div class= "contenedor">
      <h1 class="title"> Bienvenido a LostPets</h1> 
      <p class="subtitle">A traves de nuestra pagina queremos poder dar una herramienta para recuperar/publicar mascotas perdidas</p>
      <p class="subtitle">Por favor</p>
      <button id="logIn" class="button">Inicia sesion</button>
      <p class="subtitle">O</p>
      <button id="signUp" class="button">Registrate</button>
      <p id="signUp" class="subtitle">Para comenzar</p>
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

    const loginButton = this.shadow.getElementById("logIn");
    loginButton.addEventListener("click", () => {
      Router.go("login-page");
    });
    const registerButton = this.shadow.getElementById("signUp");
    registerButton.addEventListener("click", () => {
      Router.go("signup-page");
    });
  }
}
customElements.define("homepage-comp", Homepage);
