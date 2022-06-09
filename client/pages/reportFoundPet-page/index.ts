import { state } from "../../state";
class ReportFoundpage extends HTMLElement {
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
        <form class="form">
          <h1 class="title">Reportar al dueño de la mascotas tus datos.</h1>
          <label class="label">Tu nombre
          <input type="text" class="input name">
          </label>
          <label class="label">Tu teléfono
          <input type="number" class="input phone">
          </label>
          <label class="label">¿Donde lo viste?
          <input type="text" class="input where">
          </label>
          <button class="button">Reportar</button>
        </form>
        `;
      style.innerHTML = `
          .title{
            font-family: 'Austie Bost Kitten Klub', sans-serif;
            font-size: 52px;  
          }
          .form{
            display:flex;
            flex-direction: column;
            height: 150vh;
            text-align: center;
            justify-content: space-evenly;
          }
          .label{
            display: flex;
            margin-top: 17px;
            flex-direction: column;
            align-items: center;
            font-family: 'Austie Bost Kitten Klub', sans-serif;
            font-size: 52px;
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
            top: 130%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'PT Sans', sans-serif;
            font-size: 20px;
            color: red;
          }
          .where{
            height: 100px;
          }
        `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);

      const nameValue = this.shadow.querySelector(".name") as HTMLInputElement
      const phoneValue = this.shadow.querySelector(".phone") as HTMLInputElement
      const textValue = this.shadow.querySelector(".where") as HTMLInputElement
      
      const buttonEl = this.shadow.querySelector(".button")
      buttonEl.addEventListener("click",(e)=>{
          e.preventDefault()
          
          
          
          state.foundPet(nameValue.value,phoneValue.value,textValue.value).then((resp)=>{
            if(resp){
                const p = document.createElement("p");
            const formEL = this.shadow.querySelector(".form");
            p.textContent = "Aviso enviado correctamente";
            p.className = "error";
            formEL.appendChild(p);
            setTimeout(function () {
              formEL.removeChild(p);
            }, 5000);
            }else{
                const p = document.createElement("p");
            const formEL = this.shadow.querySelector(".form");
            p.textContent = "ERROR = No se pudo enviar, intentelo de nuevo.";
            p.className = "error";
            formEL.appendChild(p);
            setTimeout(function () {
              formEL.removeChild(p);
            }, 5000);
            }    
          })
          
      })
    }
  }
  customElements.define("foundpet-comp", ReportFoundpage);