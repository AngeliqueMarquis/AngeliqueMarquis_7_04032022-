<template>
<body class="text-center">
    
<main class="form-signin">
    <img class="mb-4" src="../assets/logo.png" alt="Logo de Groupomania" width="300" height="158">
    <h1 v-if="mode == 'login' " class="h3 mb-3 fw-normal">Connexion</h1>
    <h1 v-else class="h3 mb-3 fw-normal">Inscription</h1>
    <div class="form" v-if="mode == 'create'">
      <div class="form-floating">
        <input v-model="firstname" type="text" class="form-control" id="floatingInput" placeholder="Prénom">
        <label for="floatingInput">Prénom</label>
      </div> 
      
      <div class="form-floating">
        <input v-model="lastname" type="text" class="form-control" id="floatingPassword" placeholder="Nom">
        <label for="floatingPassword">Nom</label>
      </div>
  </div>

  <div class="form">
      <div class="form-floating">
        <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="Adresse email">
        <label for="floatingInput">Adresse email</label>
      </div>
      <div class="form-floating">
        <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Mot de passe">
        <label for="floatingPassword">Mot de passe</label>
      </div>
      <p class="error__msg">{{ error }}</p>
      <button @click="login()" v-if="mode == 'login'" class="w-100 btn btn-lg btn-primary" type="submit">Connexion</button>
      <button @click="createAccount()" v-else class="w-100 btn btn-lg btn-primary" type="submit">Inscription</button>
      <p v-if="mode == 'login' " class="mt-5 mb-3 text-muted">Pas encore de compte ? <span class="login" @click="switchToCreateAccount()">Créer un compte</span> </p>
      <p v-else class="mt-5 mb-3 text-muted">Vous avez déjà un compte ? <span class="login" @click="switchToLogin()">Se connecter</span></p>
  </div>
</main>    
  </body>
</template>

<script>
import axios from 'axios';

export default {
  name: 'login',
  data () {
       return {
       mode: 'login',
       firstname: '',
       lastname: '',
       email: '',
       password: '',
       error: '',
       userRegex: /^[-'a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,}$/,
       emailRegex: /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/,
       passwordRegex:  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,50}$/
      };
},

methods: {   
    switchToCreateAccount() {
      this.mode = 'create';
    },

    switchToLogin() {
      this.mode = 'login';
    }, 

    createAccount() {
      if (!this.userRegex.test(this.firstname)) {
        return (this.error = 'Prénom non valide');
        } else if (!this.userRegex.test(this.lastname)) {
        return (this.error = 'Nom non valide');
        } else if (!this.emailRegex.test(this.email)) {
        return (this.error = 'Email non valide');
        } else if (!this.passwordRegex.test(this.password)) {
        return (this.error = 'Votre mot de passe doit contenir au moins 6 caractères, un chiffre, une minuscule et une majuscule');
        }
      const self = this;
      axios.post('http://localhost:3000/api/user/signup', {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      })
      .then(() => {
        self.login();
      })
      .catch(error => {
        console.log(error);
      });
    },
    
    login () {
      const self = this;
      axios.post('http://localhost:3000/api/user/login', {
        email: this.email,
        password: this.password,
      })
      .then(response => {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        self.$router.push('/post')
        })
        .catch(error => {
        return (this.error = 'Utilisateur ou Mot de passe incorrect')
      });
    },
  }
} 
</script>

<style>
.bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
html,
body {
  height: 100%;
}

body {
  padding-top: 40px;
  padding-bottom: 40px;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

</style>


