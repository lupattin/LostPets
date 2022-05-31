import { Router } from "@vaadin/router";
import { state } from "../../state";
class Loginpage extends HTMLElement {
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
      <form class="form">
        <label class="label">Email
        <input type="text" class="input email">
        </label>
        <label class="label">Contraseña
        <input type="password" class="input password">
        </label>
        <button class="button">Iniciar Sesion</button>
      </form>
      `;
    style.innerHTML = `
        .form{
          display:flex;
          flex-direction: column;
          height: 100vh;
          justify-content: space-evenly;
        }
        .label{
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Austie Bost Kitten Klub', sans-serif;
          font-size: 72px;
        }
        .input{
          width: 250px;
          height: 20px;
          border: solid red;
        }
        .button{
          width: 250px;
          height: 60px;
          border: solid red;
          margin: 115px auto;
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
        }
        .error{
          position: absolute;
          top: 70%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
          color: red;
        }
      `;
    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    const buttonEL = this.shadow.querySelector(".button");
    const emailEL = this.shadow.querySelector(".email") as HTMLInputElement;
    const passwordEL = this.shadow.querySelector(
      ".password"
    ) as HTMLInputElement;
    buttonEL.addEventListener("click", (e) => {
      e.preventDefault();
      if (emailEL.value && passwordEL.value) {
        state.signIn(emailEL.value, passwordEL.value).then((data) => {
          if (data.token) {
            
            Router.go("location-page");
          } else if (data.Error) {
            const p = document.createElement("p");
            const formEL = this.shadow.querySelector(".form");
            p.textContent = "ERROR = Email o Password Incorrectos";
            p.className = "error";
            formEL.appendChild(p);
            setTimeout(function () {
              formEL.removeChild(p);
            }, 5000);
          }
        });
      } else {
        const p = document.createElement("p");
        const formEL = this.shadow.querySelector(".form");
        p.textContent = "ERROR = Falta completar datos";
        p.className = "error";
        formEL.appendChild(p);
        setTimeout(function () {
          formEL.removeChild(p);
        }, 5000);
      }
    });
  }
}
customElements.define("login-comp", Loginpage);
