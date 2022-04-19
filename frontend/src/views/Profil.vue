<template>
         <div class="main-body">
          <Header />
          <div class="row flex-column mt-5">
            <div class="col-lg-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex flex-column align-items-center text-center">
                    <img :src="image" alt="Photo de profil" class="rounded-circle p-1" width="110" >
                    <div class="mt-3">
                      <p>{{firstname}} {{lastname}}</p>
                      <p class="admin" v-if="userId ==='1'">Administrateur</p>
                      <label for="file" class="btn btn-outline-primary" >Modifier ma photo</label>
                      <input class="d-none" type="file" accept="image/*" id="file" v-on:change="uploadImage">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="card">
                <div class="card-body">
                  <div class="row mb-3">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Prénom</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <input type="text" class="form-control" v-model="newFirstname">
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Nom</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <input type="text" class="form-control" v-model="newLastname">
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Mot de passe</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <input type="password" v-model="password" required class="form-control">
                    </div>
                    <div class="confirm_modification">
                      <p>Veuillez confirmer votre mot de passe afin d'enregistrer vos données</p>
                    </div>
                  </div>
                    <div class="col-sm-3"></div>
                    <div class="sm-4 text-secondary mt-5 d-flex flex-column align-items-center">
                      <input @click="updateUser()" type="button" class="btn btn-primary px-4" value="Enregistrer" :disabled="!password">
                      <p class="desactivate" @click="deleteUser()">Supprimer mon compte</p>

                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div> 
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';

export default { 
    name: 'Profil',
    components: {
    Header
  },
  data () {
    return {
        firstname: '',
        lastname: '',
        image: '',
        userId: localStorage.getItem('userId'),
        newFirstname: '',
        newLastname: '', 
        // valid: true,
    }
},

beforeMount () {
  if (!localStorage.getItem('userId')) {
    this.$router.push('/');
    }
},

mounted () {
     const id = localStorage.getItem('userId')
     axios.get(`http://localhost:3000/api/user/${id}`)
     .then((response) => {
       this.firstname = response.data.firstname
       this.lastname = response.data.lastname
       this.image = response.data.image  

 })
     .catch((error ) => {
      console.log(error);
    });
},

methods : {
    uploadImage(event) {
        const id = localStorage.getItem('userId')
        this.image = event.target.files[0];
        const fd = new FormData()
        fd.append('image', this.image)
        axios.put(`http://localhost:3000/api/user/${id}`, fd,{
           headers: {
           'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
         })
         .then((response) => {
           this.image = response.data.image
           window.location.reload();
        })
         .catch((error) => {
          console.log(error)
       });
    },

    updateUser() {
      if (confirm('Voulez vous vraiment modifier vos informations ? ') == true) {
      const id = localStorage.getItem('userId')
      const fd = new FormData()
      fd.append('firstname', this.newFirstname)
      fd.append('lastname', this.newLastname)
      fd.append('password', this.newPassword)
      axios.put(`http://localhost:3000/api/user/${id}`, fd,{
         headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then((response) => {
          this.newFirstname = response.data.firstname
          this.newLastname = response.data.lastname
          this.newPassword= response.data.password
          window.location.reload();
          console.log(response);
        })
         .catch((error) => {
          console.log(error)
       });
      }
    },
    
    deleteUser() {
      if (confirm('Voulez vous vraiment supprimer votre compte ?') == true) {
      const id = localStorage.getItem('userId')
      axios.delete(`http://localhost:3000/api/user/${id}`, {
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
       .then((response) => {
         console.log(response);
      })
      .catch((error) => {
          console.log(error)
       });
      localStorage.clear()
      alert('Votre compte a été supprimé');
      this.$router.push( '/')
    }   
  } 
 }
}
</script>


<style>
body{
    background: #f7f7ff;
    margin-top:20px;
}
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid transparent;
    border-radius: .25rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%);
}
.me-2 {
    margin-right: .5rem!important;
}

.col-lg-4 {
  margin-top: 2%;
}

.row {
  width: 90%;
  padding-left: 10%;
  align-items: center;
  margin-top: 5%;
}

.mt-3 p {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.p-1 {
  background:#FDCCC5 ;
}

.confirm_modification {
  color: #cbcacc;
}
 
</style>