import { Router } from "@vaadin/router";
import { state } from "../../state";
class SignUppage extends HTMLElement {
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
      <form action="" class="form">
        <label class="label">Nombre
        <input type="text" class="input name" required>
        </label>
        <label class="label">Contraseña
        <input type="password" class="input password" required>
        </label>
        <label class="label">Email
        <input type="email" class="input email" required>
        </label>
        <button class="button">Registrarse</button>
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
          font-size: 42px;
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
    const nameEl = this.shadow.querySelector(".name") as HTMLInputElement;
    const passwordEl = this.shadow.querySelector(
      ".password"
    ) as HTMLInputElement;
    const emailEl = this.shadow.querySelector(".email") as HTMLInputElement;


    buttonEL.addEventListener("click", (e) => {
      e.preventDefault();
      if (nameEl.value && passwordEl.value && emailEl.value) {
        state
          .signUp(nameEl.value, passwordEl.value.toString(), emailEl.value)
          .then((data) => {
            if (data.created == false) {
              const p = document.createElement("p");
              const formEL = this.shadow.querySelector(".form");
              p.textContent = "ERROR = Email ya registrado";
              p.className = "error";
              formEL.appendChild(p);
              setTimeout(function () {
                formEL.removeChild(p);
              }, 5000);
            }else{
              const p = document.createElement("p");
              const formEL = this.shadow.querySelector(".form");
              p.textContent = "Te has registrado correctamente.";
              p.className = "error";
              formEL.appendChild(p);
              setTimeout(function () {
                Router.go("location-page");
              }, 5000);
            }
          });
      } else {
        const p = document.createElement("p");
        const formEL = this.shadow.querySelector(".form");
        p.textContent = "ERROR = Falta completar un campo";
        p.className = "error";
        formEL.appendChild(p);
        setTimeout(function () {
          formEL.removeChild(p);
        }, 5000);
      }
    });
  }
}
customElements.define("signup-comp", SignUppage);
