import { Router } from "@vaadin/router";
import { state } from "../../state";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
class MapPetspage extends HTMLElement {
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
    <div class="contenedor">
        <h1 class="title">Mapa de mascotas reportadas según tu ubicación</h1>
        <map-comp class="map"></map-comp>
        <p class="subtitle"> Buscar en otra ubicación</p>
        <label class="label">Calle/Avenida
          <input type="text" class="input street" placeholder="Ej:calle falsa">
        </label>
        <label class="label">Altura
          <input type="number" class="input streetLevel" placeholder="Ej:1234">
        </label>
        <label class="label">Barrio/Ciudad
          <input type="text" class="input cityplace" placeholder="Ej:San Carlos de Bariloche">
        </label>
        <button class="button check">Chequear</button>
    </div>
    `;
    style.innerHTML = `
    .contenedor{
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      text-align: center;
      height: 160vh;
    }
    .title{
      font-family: 'Austie Bost Kitten Klub', sans-serif;
      font-size: 42px;
      margin-bottom: 0;
    }
    .subtitle{
      font-family: 'Austie Bost Kitten Klub', sans-serif;
      font-size: 38px;
      margin: 0;
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
    .contenedor-marker{
      height: 180px;
      width: 200px;
    }
    .image{
      height: 115px;
      width: 100%;
    }
    .datatext{
      font-family: 'Austie Bost Kitten Klub', sans-serif;
      font-size: 18px;
      margin: 0;
    }
    .data_container{
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .button_map{
      height: 50px;
      width: 120px;
    }
    `;

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);

    /* Busca Mascotas reportadas segun la ubicacion del usuario */

    const lat = state.getState().lat;
    const lng = state.getState().lng;
    const map = state.data.map as any;

    map.on("idle", function () {
      map.resize();
    });

    state.searchPetsFromAlgolia(lat, lng).then((results) => {
      for (const pets of results) {
        
        
        /* Creo HTML para los clicks en los markers de mapbox */
        const porUpDraw = `
        <div class="contenedor-marker">
                <img class="image" src=${pets.image}>
                <div class="data_container">
                  <div class="data">
                      <h2 class="datatext">${pets.name}</h2>
                      <p class="datatext">${pets.street} ${pets.level}</p>
                  </div>
                  <button class="botonMapa" onclick="hacerClick()">¡Lo encontre!</button>
                </div>
              </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(porUpDraw);
        const { lat, lng } = pets._geoloc;
        const marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);
        map.setCenter({ lon: lng, lat: lat });
        map.setZoom(13);
        marker.getElement().addEventListener("click", () => {
          state.petToReport.userId = pets.userId;
          state.petToReport.petName = pets.name;
        });
      }
    });

    const buttonCheckEl = this.shadow.querySelector(".check");
    const streetEl = this.shadow.querySelector(".street") as HTMLInputElement;
    const streetLevelEl = this.shadow.querySelector(
      ".streetLevel"
    ) as HTMLInputElement;
    const cityPlaceEl = this.shadow.querySelector(
      ".cityplace"
    ) as HTMLInputElement;
    let coordinates;

    buttonCheckEl.addEventListener("click", () => {
      state
        .getDirectionFromNominatim(
          streetEl.value,
          streetLevelEl.value,
          cityPlaceEl.value
        )
        .then((coord) => {
          const newLat = parseFloat(coord.lat);
          const newLon = parseFloat(coord.lon);

          const latMaxLenght = newLat.toFixed(7);
          const lonMaxLenght = newLon.toFixed(7);

          const newCoordinates = { lat: latMaxLenght, lon: lonMaxLenght };
          coordinates = newCoordinates;
          map.setCenter({ lon: lonMaxLenght, lat: latMaxLenght });
          map.setZoom(13);
          state
            .searchPetsFromAlgolia(latMaxLenght, lonMaxLenght)
            .then((results) => {
              for (const pets of results) {
                
                
                /* Creo HTML para los clicks en los markers de mapbox */
                const porUpDraw = `
                <div class="contenedor-marker">
                <img class="image" src=${pets.image}>
                <div class="data_container">
                  <div class="data">
                      <h2 class="datatext">${pets.name}</h2>
                      <p class="datatext">${pets.street} ${pets.level}</p>
                  </div>
                  <button class="botonMapa" onclick="hacerClick()">¡Lo encontre!</button>
                </div>
              </div>
            `;

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                  porUpDraw
                );
                const { lat, lng } = pets._geoloc;
                const marker2 = new mapboxgl.Marker()
                  .setLngLat([lng, lat])
                  .setPopup(popup)
                  .addTo(map);
                map.setCenter({ lon: lonMaxLenght, lat: latMaxLenght });
                map.setZoom(13);
                marker2.getElement().addEventListener("click", () => {
                  state.petToReport.userId = pets.userId;
                  state.petToReport.petName = pets.name;
                });
              }
            });
        });
    });
  }
}
customElements.define("mappets-comp", MapPetspage);
