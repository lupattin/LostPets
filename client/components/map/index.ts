import { initMapbox } from "../../lib/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import { state } from "../../state";
class Mapcomp extends HTMLElement {  
    constructor() {
      super();
      this.render();
    }
  
    render() {
      
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.innerHTML = `
      <link href="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css"rel="stylesheet"/>
      <div class="mapa" id="map" style="width: 500px; height: 500px"></div>
      `;
      style.innerHTML = `
  
        .mapboxgl-control-container {
            display: none;
        }
      `;
      this.appendChild(div)
      this.appendChild(style)

      const mapDiv = this.querySelector(".mapa")
  
      
     const map = initMapbox(mapDiv)
      state.data.map = map
      
      
    }
  }
  customElements.define("map-comp", Mapcomp);
  