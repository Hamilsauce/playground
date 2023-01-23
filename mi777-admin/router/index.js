import { createRouter, createWebHashHistory } from 'vue-router'
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import TokensView from '../views/tokens.view.js';


const { template, utils } = ham;



const Home = { template: template('home-view')}
// const Tokens = 
const Users = { template: template('users-view')}

const routes = [
  { path: '/', component: Home },
  { path: '/users', component: Users },
  { path: '/tokens', component: TokensView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

