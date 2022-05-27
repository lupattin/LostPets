import { Router } from "@vaadin/router";
import { state } from "../../state";
class Headercomp extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "contenedor";
    const logoUrl = new URL("../../images/logo.png", import.meta.url);

    div.innerHTML = `
    <h1 class="title">LostPets</h1>
    <div class="logo"></div>
      <nav role="navigation">
      <div id="menuToggle">
        <input type="checkbox"/>
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">
          <a href="/home-page"><li class="link1">Inicio</li></a>
          <a class="alink2" href="/login-page"><li class="link2">Inciar Sesion</li></a>
          <a class="alink3" href="/signup-page"><li class="link3">Registrarse</li></a>
          <a class="alink4" href="/reportPet-page"><li class="link4">Reportar Mascota</li></a>
          <a class="alink5" href="/map-pets-page"><li class="link5">Mapa de Mascotas</li></a>
          <p class= "user"></p>
        </ul>
      </div>
        </nav>
      `;

    style.innerHTML = `
     
    .contenedor{
        background-color: red;
        height: 80px;
        display: flex;
      }
    .user{
        color:red;
        font-family: 'Austie Bost Kitten Klub', sans-serif;
        font-size: 30px;
      }
    .logo{
        background: url(${logoUrl});
        height: 34px;
        width: 40px;
        position: absolute;
        left: 82%;
        top: 30px;
      }
      @media (min-width:600px){
        .logo{
          left: 88%;
        }
      }
      @media (min-width:1000px){
        .logo{
          left: 90%;
        }
      }
      @media (min-width:1000px){
        .logo{
          left: 94%;
        }
      }
      .title{
        font-family: 'Austie Bost Kitten Klub', sans-serif;
        font-size: 30px;
        width: 200px;
        position: absolute;
        left: 50%;
        top: 28px;
        right: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
      }
    #menuToggle{
      display: block;
      position: relative;
      top: 30px;
      left: 35px;
      z-index: 1;
      -webkit-user-select: none;
      user-select: none;
      }
    #menuToggle a{
      text-decoration: none;
      color: #232323;  
      transition: color 0.3s ease;
      }

    #menuToggle a:hover{
      color: tomato;
      }
    #menuToggle input{
      display: block;
      width: 40px;
      height: 32px;
      position: absolute;
      top: -7px;
      left: -5px;
      cursor: pointer;
      opacity: 0;
      z-index: 2;
      -webkit-touch-callout: none;
      }
    #menuToggle span{
      display: block;
      width: 33px;
      height: 4px;
      margin-bottom: 5px;
      position: relative;
      background: #cdcdcd;
      border-radius: 3px; 
      z-index: 1;
      transform-origin: 4px 0px; 
      transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                  background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                  opacity 0.55s ease;
      }
    #menuToggle span:first-child{
      transform-origin: 0% 0%;
      }
    #menuToggle span:nth-last-child(2){
      transform-origin: 0% 100%;
      }
    #menuToggle input:checked ~ span{
      opacity: 1;
      transform: rotate(45deg) translate(-2px, -1px);
      background: #232323;
      }
    #menuToggle input:checked ~ span:nth-last-child(3){
      opacity: 0;
      transform: rotate(0deg) scale(0.2, 0.2);
      }
    #menuToggle input:checked ~ span:nth-last-child(2){
      transform: rotate(-45deg) translate(0, -1px);
      }
    #menu{
      position: absolute;
      width: 300px;
      margin: -100px 0 0 -50px;
      padding: 50px;
      padding-top: 125px; 
      background: #ededed;
      list-style-type: none;
      -webkit-font-smoothing: antialiased;
          transform-origin: 0% 0%;
          transform: translate(-100%, 0);
          transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
      }
    #menu li{
      padding: 10px 0;
      font-size: 22px;
      }
    #menuToggle input:checked ~ ul{
      transform: none;
      }`;
    shadow.appendChild(div);
    shadow.appendChild(style);

    if (this.getAttribute("type") == "inicio") {
      const link4El = shadow.querySelector(".link4") as HTMLLinkElement;
      const link5El = shadow.querySelector(".link5") as HTMLLinkElement;
      link4El.style.display = "none";
      link5El.style.display = "none";
      const logoEl = shadow.querySelector(".logo");
      logoEl.addEventListener("click", () => {
        Router.go("home-page");
      });
    } else if (this.getAttribute("type") == "Ingresado") {
      const userEl = shadow.querySelector(".user") as HTMLLinkElement;
      userEl.textContent = `¡Hola ${state.getState().name}!`

      const link1El = shadow.querySelector(".link1") as HTMLLinkElement;
      const link2El = shadow.querySelector(".link2") as HTMLLinkElement;
      const link3El = shadow.querySelector(".link3") as HTMLLinkElement;

      link1El.textContent = "Cerrar Sesión";
      link2El.textContent = "Menu";
      link3El.textContent = "Mis Mascotas Reportadas";

      link1El.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("data");
        Router.go("home-page");
      });

      const alink2El = shadow.querySelector(".alink2") as HTMLLinkElement;
      alink2El.href = "/menu-page";
      const alink3El = shadow.querySelector(".alink3") as HTMLLinkElement;
      alink3El.href = "/pets-page";
      const alink5El = shadow.querySelector(".alink5") as HTMLLinkElement;
      alink5El.href = "/map-pets-page";
      const logoEl = shadow.querySelector(".logo");
      logoEl.addEventListener("click", () => {
        Router.go("menu-page");
      });
    }
  }
}
customElements.define("header-comp", Headercomp);
