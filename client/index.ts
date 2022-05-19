/* import componentes */
import "./components/header"
import "./components/map"
import "./images/logo.png"

/* Import pages */
import "./pages/home-page"
import "./pages/login-page"
import "./pages/signup-page"
import "./pages/location-page"
import "./pages/menu-page"
import "./pages/datos-page"
import "./pages/reportPet-page"
import "./pages/mappets-page"
import "./pages/pets-page"
import "./pages/reportFoundPet-page"

/* import tools */
import "./router"
import { Router } from "@vaadin/router";

function main(){
    Router.go("home-page")
}

main()