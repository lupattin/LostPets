import {Router} from '@vaadin/router';

const router = new Router(document.querySelector('.root'));
router.setRoutes([
  {path: '/', component: 'homepage-comp'},
  {path: '/home-page', component: 'homepage-comp'},
  {path: '/login-page', component: 'login-comp'},
  {path: '/signup-page', component: 'signup-comp'},
  {path: '/location-page', component: 'location-comp'},
  {path: '/menu-page', component: 'menu-comp'},
  {path: '/datos-page', component: 'datos-comp'},
  {path: '/reportPet-page', component: 'reportpet-comp'},
  {path: '/map-pets-page', component: 'mappets-comp'},
  {path: '/pets-page', component: 'pets-comp'},
  {path: '/foundpet-page', component: 'foundpet-comp'}
  
]);