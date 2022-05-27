import { dropzoneUpload } from "../../lib/dropzone";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { initMapbox } from "../../lib/mapbox";
import { stack } from "sequelize/types/utils";
import { state } from "../../state";
import { Router } from "@vaadin/router";
class ReportPetpage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");
    const defaultUrl = new URL("../../images/defaultpet.jpg", import.meta.url);
    div.innerHTML = `
      <header-comp type="Ingresado"></header-comp>
      <div class="contenedor">
          <h1 class="title"> Reportar Mascota</h1>
          <label class="label">Nombre de la mascota
            <input type="text " class="input name">
          </label>
          <label class="label">Imagen</label>
          <div class="imagenPet"></div>
          <p class="subtitle">Datos de donde fue encontrada</p>
          <label class="label">Calle/Avenida
            <input type="text" class="input street" placeholder="Ej:calle falsa">
          </label>
          <label class="label">Altura
            <input type="number" class="input streetLevel" placeholder="Ej:1234">
          </label>
          <label class="label">Barrio/Ciudad
            <input type="text" class="input cityplace" placeholder="Ej:San Carlos de Bariloche">
          </label>
          <p class="subtitle ">Chequea en el mapa la direccion correcta</p>
          <map-comp></map-comp>
          <div class="contenedor_botones">
              <button class="button check">Chequear</button>
              <button class="button report">Reportar</button>
              <button class="button back">Volver</button>
          </div>
      </div>
      `;
    style.innerHTML = `
          .contenedor{
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: center;
            text-align: center;
            height: 300vh;
          }
          .contenedor_botones{
            display: flex;
            height: 180px;
            flex-direction: column;
            justify-content: space-between;
          }
          .title{
            font-family: 'Austie Bost Kitten Klub', sans-serif;
            font-size: 72px;
            margin-bottom: 0;
          }
          .subtitle{
            font-family: 'Austie Bost Kitten Klub', sans-serif;
            margin-top: 50px;
            font-size: 30px;
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
            background: url(${defaultUrl});
            object-fit: contain;
          }
          .dz-details{
            display:none
          }
          .exito{
            position: absolute;
            top: 282%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'PT Sans', sans-serif;
            font-size: 20px;
            color: red;
          }
      `;

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);

    const imageEl = this.shadow.querySelector(".imagenPet") as HTMLDivElement;
    const buttonEl = this.shadow.querySelector(".button");

    let pictureImage;
    const dropzoneInit = dropzoneUpload(imageEl, buttonEl);

    dropzoneInit.on("addedfile", function (file) {
      imageEl.style.background = "none";
      pictureImage = file;
    });
    /* Buscador de la direccion de donde encontraron la mascota */
    const buttonCheckEl = this.shadow.querySelector(".check");
    const streetEl = this.shadow.querySelector(".street") as HTMLInputElement;
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
            .savePetData(
              nameEl.value,
              streetEl.value,
              streetLevelEl.valueAsNumber,
              cityPlaceEl.value,
              coord.lon,
              coord.lat,
              pictureImage.dataURL
            )
            .then((resp) => {
              if (resp) {
                const p = document.createElement("p");
                const divEL = this.shadow.querySelector(".contenedor");
                p.textContent = "Mascota reportada correctamente";
                p.className = "exito";
                divEL.appendChild(p);
                setTimeout(function () {
                  divEL.removeChild(p);
                }, 5000);
              }else{
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
    /* Volver al menu */
    const buttonBackEl = this.shadow.querySelector(".back");

    buttonBackEl.addEventListener("click", () => {
      Router.go("menu-page");
    });
  }
}
customElements.define("reportpet-comp", ReportPetpage);
