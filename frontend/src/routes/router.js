import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Post from '../views/Post.vue'
import Profil from '../views/Profil.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  }, {
    path: '/post',
    name: 'Post',
    component: Post
  }, {
    path: '/profil',
    name: 'Profil',
    component: Profil
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
