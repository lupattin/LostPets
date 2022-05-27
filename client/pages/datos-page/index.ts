import { Router } from "@vaadin/router";
import { state } from "../../state";
class Datospage extends HTMLElement {
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
      <form action="" class="form">
        <label class="label">Nombre
        <input type="text" class="input name" value="${
          state.getState().name
        }"required>
        </label>
        <label class="label">Email
        <input type="email" class="input email" value="${
          state.getState().email
        }"required>
        </label>
        <label class="label">Nueva Contraseña
        <input type="password" class="input password newpass" required>
        </label>
        <label class="label">Confirmar Contraseña
        <input type="password" class="input password confirmpass" required>
        </label>
        <button class="button guardar">Guardar</button>
        <button class="button volver">Volver</button>
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
      text-align: center;
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
      margin: 10px auto;
      font-family: 'PT Sans', sans-serif;
      font-size: 20px;
    }
    .volver{
      margin: 0px auto;
    }
    .error{
      position: absolute;
      top: 80%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'PT Sans', sans-serif;
      font-size: 20px;
      color: red;
    }
    `;
    this.shadow.appendChild(div);
    this.shadow.appendChild(style);

    const guardarEL = this.shadow.querySelector(".guardar");
    const volvernEL = this.shadow.querySelector(".volver");
    const nameEL = this.shadow.querySelector(".name") as HTMLInputElement;
    const emailEL = this.shadow.querySelector(".email") as HTMLInputElement;
    const newPassEL = this.shadow.querySelector(".newpass") as HTMLInputElement;
    const confirmPassEL = this.shadow.querySelector(
      ".confirmpass"
    ) as HTMLInputElement;

    guardarEL.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        newPassEL.value &&
        confirmPassEL.value &&
        nameEL.value &&
        emailEL.value
      ) {
        if (newPassEL.value === confirmPassEL.value) {
          state
            .updateData(nameEL.value, emailEL.value, confirmPassEL.value)
            .then(() => {
              const p = document.createElement("p");
              const formEL = this.shadow.querySelector(".form");
              p.textContent = "Datos Guardados con exito";
              p.className = "error";
              formEL.appendChild(p);
              setTimeout(function () {
                formEL.removeChild(p);
              }, 5000);
            });
        } else {
          const p = document.createElement("p");
          const formEL = this.shadow.querySelector(".form");
          p.textContent = "Las contraseñas no coinciden";
          p.className = "error";
          formEL.appendChild(p);
          setTimeout(function () {
            formEL.removeChild(p);
          }, 5000);
        }
      }else {
        const p = document.createElement("p");
        const formEL = this.shadow.querySelector(".form");
        p.textContent = "Falta completar alguno de los datos";
        p.className = "error";
        formEL.appendChild(p);
        setTimeout(function () {
          formEL.removeChild(p);
        }, 5000);
      }
    });
    volvernEL.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("menu-page");
    });
  }
}
customElements.define("datos-comp", Datospage);
