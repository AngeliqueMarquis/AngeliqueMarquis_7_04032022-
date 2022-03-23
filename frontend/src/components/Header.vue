<template>
 <header class="header"> 
    <nav class="navbar navbar-default">
  <div class="container-fluid d-flex justify-content-between ms-5 me-5">
        <router-link to="/post"><img src="../assets/logo-copy.png" class="header__logo" alt="logo Groupomania" width="250"></router-link>
      <form class="navbar-form navbar-left d-flex align-items-center d-none">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="">
        </div>
        <button type="submit" class="btn btn-secondary disabled"> Chercher</button>
      </form>
      <ul class="nav navbar-nav navbar-right flex-row align-items-center">
        <li><router-link to="/profil"><img :src="image" class="rounded-circle me-5" alt="photo de profil" width="50"></router-link></li>
        <li class="link"><a @click="logout()" href="#">Se déconnecter</a></li>
      </ul>
    </div>
</nav>
  </header>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Header',
    data () {
    return {
        image: '',
    }
},

mounted ()  {
    const id = localStorage.getItem('userId')
    axios.get(`http://localhost:3000/api/user/${id}`)
     .then((response) => {
       this.image = response.data.image  
    })
      .catch((error ) => {
        console.log(error);
    });
  },

methods: {
    logout() {
        localStorage.clear()
        this.$router.push('/');
    },
  }
}
</script>


<style>
body {
  padding-bottom: 20px;
}

.navbar {
  margin-bottom: 20px;
}

.link {
  padding-left: 0.5em;
}

.link a {
  text-decoration: none;
  color: black;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
</style>