import { Router } from "@vaadin/router";
import { state } from "../../state";
import { dropzoneUpload } from "../../lib/dropzone";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
class Petspage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "contenedor_total";

    div.innerHTML = `
    <header-comp type="Ingresado"></header-comp>
    <h1 class= "title">Mis Mascotas Reportadas</h1>
    <div class= "contenedor">
    </div>
    `;
    style.innerHTML = `
        .contenedor{
          display: flex;
          margin-top: 20px;
          justify-content: space-evenly;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .title{
          font-family: 'Austie Bost Kitten Klub', sans-serif;
          font-size: 62px;
          text-align: center; 
        }
        .pet_container{
          border: solid;
          height: 300px;
          width: 300px;
          margin: 10px;
        }
        .image{
          height: 200px;
          width: 100%;
        }
        .data_container{
          display: flex;
          height: 96px;
          background: grey;
          justify-content: space-around;
          align-items: center;
        }
        .subtitle{
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
        }
        .edit{
          display: flex;
          align-items: center;
          color: red;
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
          height: 50px;
          width: 100px;
          justify-content: center;
        }
        .label{
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Austie Bost Kitten Klub', sans-serif;
          font-size: 32px;
        }
        .input{
          width: 250px;
          height: 20px;
          border: solid red;
          text-align: center;
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
        .imagenPet{
          height: 130px;
          width: 200px;
          background: url(${""});
          object-fit: contain;
        }
        .dz-details{
          display:none
        }
        .contenedor_botones{
          display: flex;
          height: 180px;
          flex-direction: column;
          justify-content: space-between;
        }
        .exito{
          position: absolute;
          top: 269%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'PT Sans', sans-serif;
          font-size: 20px;
          color: red;
        }
        
    `;
    this.shadow.appendChild(div);
    this.shadow.appendChild(style);

    const contenedorTotalEl = this.shadow.querySelector(
      ".contenedor_total"
    ) as HTMLDivElement;
    const contenedorEl = this.shadow.querySelector(".contenedor");

    state.petsById().then((data) => {
      for (const pet of data) {
        

        const newPet = document.createElement("div");
        newPet.innerHTML = `
        <div class="pet_container">
        <img class="image" src=${pet.image}>
        <div class="data_container">
            <div class="data">
                <h2 class="subtitle">${pet.name}</h2>
                <p class="subtitle">${pet.city}</p>
            </div>
            <button class="edit">Editar</button>
        </div>
      </div>
        `;
        contenedorEl.appendChild(newPet);
        /* Elimino HTML y monto pagina para editar pet */
        const buttonEditEl = newPet.querySelector(".edit");
        buttonEditEl.addEventListener("click", (e) => {
          e.preventDefault();
          contenedorEl.remove();
          const editPet = document.createElement("div");
          editPet.innerHTML = `
        <div class="contenedor">
          <h1 class="title"> Editar datos de ${pet.name}</h1>
          <label class="label">Nombre de la mascota
            <input type="text " class="input name" value=${pet.name}>
          </label>
          <label class="label">Imagen</label>
          <div class="imagenPet"></div>
          <p class="subtitle">Datos de donde fue encontrada</p>
          <label class="label">Calle/Avenida
            <input type="text" class="input street" placeholder="Ej:calle falsa" value=${pet.street}>
          </label>
          <label class="label">Altura
            <input type="number" class="input streetLevel" placeholder="Ej:1234" value=${pet.level}>
          </label>
          <label class="label">Barrio/Ciudad
            <input type="text" class="input cityplace" placeholder="Ej:San Carlos de Bariloche" value=${pet.city}>
          </label>
          <p class="subtitle ">Chequea en el mapa la direccion correcta</p>
          <map-comp></map-comp>
          <div class="contenedor_botones">
            <button class="button check">Chequear</button>
            <button class="button report">Editar</button>
            <button class="button back">Volver</button>
          </div>
        </div>
        `;

          contenedorTotalEl.appendChild(editPet);
          const contenedorCreadoEl = this.shadow.querySelector(
            ".contenedor"
          ) as HTMLDivElement;
          const imageEl = this.shadow.querySelector(
            ".imagenPet"
          ) as HTMLDivElement;
          const buttonEl = this.shadow.querySelector(".button");
          imageEl.style.background = `url(${pet.image})`;
          imageEl.style.backgroundSize = "200px 130px";
          contenedorCreadoEl.style.height = "270vh";
          let pictureImage;
          pictureImage = pet.image
          const dropzoneInit = dropzoneUpload(imageEl, buttonEl);

          dropzoneInit.on("addedfile", function (file) {
            imageEl.style.background = "none";
            pictureImage = file;
          });
          
          
          /* Buscador de la direccion de donde encontraron la mascota */
          const buttonCheckEl = this.shadow.querySelector(".check");
          const streetEl = this.shadow.querySelector(
            ".street"
          ) as HTMLInputElement;
          const streetLevelEl = this.shadow.querySelector(
            ".streetLevel"
          ) as HTMLInputElement;
          const cityPlaceEl = this.shadow.querySelector(
            ".cityplace"
          ) as HTMLInputElement;
          let coordinates;
          const map = state.data.map as any;
          map.on("idle", function () {
            map.resize();
          });
          buttonCheckEl.addEventListener("click", (e) => {
            e.preventDefault();
            state
              .getDirectionFromNominatim(
                streetEl.value,
                streetLevelEl.value,
                cityPlaceEl.value
              )
              .then((coord) => {
                coordinates = coord;
                new mapboxgl.Marker().setLngLat(coord).addTo(map);
                map.setCenter(coord);
                map.setZoom(14);
              });
          });
          /* Boton de volver */
          const buttonBackEl = this.shadow.querySelector(".back");
          buttonBackEl.addEventListener("click", (e) => {
            e.preventDefault();
            Router.go("menu-page")
          })
          /* Guardado de los datos de mascota reportada */
          const buttonReportEl = this.shadow.querySelector(".report");
          const nameEl = this.shadow.querySelector(".name") as HTMLInputElement;
          buttonReportEl.addEventListener("click", () => {
            state
              .getDirectionFromNominatim(
                streetEl.value,
                streetLevelEl.value,
                cityPlaceEl.value
              )
              .then((coord) => {  
                
                
                state
                  .updatePetData(
                    pet.id,
                    nameEl.value,
                    streetEl.value,
                    streetLevelEl.valueAsNumber,
                    cityPlaceEl.value,
                    coord.lon,
                    coord.lat,
                    pictureImage
                  )
                  .then((resp) => {
                    if (resp) {
                      const p = document.createElement("p");
                      const divEL = this.shadow.querySelector(".contenedor");
                      p.textContent = "Mascota modificada correctamente";
                      p.className = "exito";
                      divEL.appendChild(p);
                      setTimeout(function () {
                        divEL.removeChild(p);
                      }, 5000);
                    } else {
                      const p = document.createElement("p");
                      const divEL = this.shadow.querySelector(".contenedor");
                      p.textContent = "Error: Algun dato es incorrecto";
                      p.className = "exito";
                      divEL.appendChild(p);
                      setTimeout(function () {
                        divEL.removeChild(p);
                      }, 5000);
                    }
                  });
              });
          });
        });
      }
    });
  }
}
customElements.define("pets-comp", Petspage);
