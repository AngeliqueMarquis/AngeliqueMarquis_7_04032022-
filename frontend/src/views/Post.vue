<template>
 <div>
  <Header />
   <div class="accueil__post">
     <div class="publication">
      <img :src="image" class="avatar" alt="photo de profil"><span class="user"> {{ firstname }} {{ lastname }}</span>
        <div class="publication__post">
           <input v-model="content" type="text" placeholder="Quoi de neuf ?">
          <div class="publication__boutons">
            <label for="file" class="label__publi">Ajouter un fichier</label>
             <input type="file" accept="image/*" id="file" class="input__image" v-on:change="uploadImage">
             <button @click="createPost()">Publier</button>
          </div>
        </div>
      </div>
    </div>
    <div class="fil__post" v-for="post in posts" :key="post.id">
      <div class="post__content">
        <div class="post">
          <div class="post__details">
           <div class="user__header"><img class="post__image" :src="post.User.image" alt="photo de profil">
             <p class="post__user">{{ post.User.firstname }} {{ post.User.lastname }}<br>
                Publié le {{ postDate(post.createdAt) }}</p>
           </div>
            <div>
              <i v-if="post.userId == userId || userId ==='1'"  @click="deletePost(post.id)" class="fa fa-trash"></i>
            </div>
           </div>
        </div>  
        <div class="publi">
          <div class="publi__details">
            <div class="pubi__content">
              <p>{{ post.content }}</p>
              <div>
               <img class="publi__image" :src="post.image">
              </div>
            </div>
          </div>
        <div class="comment__button">
          <input v-model="comment" class="button__comment" type="text" placeholder="Ajouter votre commentaire">
          <button class="comment__create" @click="createComment(post.id)">Commenter</button>
        </div>
      <div class="comments" v-for="comment in comments" :key="comment.id">
          <div class="comment__user">
            <img :src="comment.User.image"  alt="photo de profil" class="comment__image">
              <div class="comment__details">
                <p>{{ comment.User.firstname}} {{ comment.User.lastname }}<br>
                {{ postDate(comment.createdAt) }}
                  <i v-if="comment.userId == userId || userId ==='1'" @click="deleteComment(comment.id)" class="fa fa-trash"></i></p>
                <p>{{ comment.textComment }}</p>
              </div>
          </div>    
         </div>
       </div>
      </div>
     </div>
    </div> 
</template>

<script>
import Header from '../components/Header.vue';
import axios from 'axios';
import moment from 'moment';

export default { 
    name: 'Post',
    components: {
    Header 
  },
  data () {
    return {
      content: '',
      image: '',
      user : {},
      post : {},
      firstname: '',
      lastname: '',
      userId: localStorage.getItem('userId'),
      posts: [],
      comments: [],
      comment: '',
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

    axios.get('http://localhost:3000/api/post/', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
     .then((response) => {
       this.posts = response.data.post;
    })
      .catch((error) => {
      console.log(error)
    });

    this.getComment();
},
 
methods: {
  postDate(date) {
    return moment(date).format('DD/MM/YYYY à hh:mm')
  },
  
  getComment() {
    axios.get(`http://localhost:3000/api/comment/`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
     .then((response) => {
       this.comments = response.data;
    })
      .catch((error) => {
      console.log(error)
    });
},

  createComment (id) {
     if(this.comment !='') {
     const self = this
     axios.post('http://localhost:3000/api/comment', {
       userId: this.userId,
       textComment: this.comment,
       postId: id },
       {
         headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token')
         }
       })
       .then((response) => {
         console.log(response);
         self.getComment()
       })
       .catch((error) => {
         console.log(error)
     })
    }
  },

  deleteComment (id) {
    axios.delete(`http://localhost:3000/api/comment/${id}`,  {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(() => {
          window.location.reload();
         })
        .catch((error) => {
          console.log(error)
        });
},
  
  deletePost (id) {
    axios.delete(`http://localhost:3000/api/post/${id}`,  {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(() => {
          window.location.reload();
         })
        .catch((error) => {
          console.log(error)
        });
  },

  uploadImage(event) {
        this.image = event.target.files[0];
  },

  createPost () {
        const fd = new FormData();
        fd.append('userId', this.userId);
        fd.append('content', this.content);
        fd.append('image', this.image);
        axios.post('http://localhost:3000/api/post', fd, {
          headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token')
         }
        })
      .then(() => {
          window.location.reload();
      })
      .catch((error) => {
          console.log(error)
      });
    }
  }
}
</script>

<style scoped lang="scss">
.accueil__post {
    display: flex;
    justify-content: center;
}

.publication {
    border: 1px solid rgb(194, 194, 194);
    width: 50%;
    padding: 15px;
    @media screen and ( max-width: 770px ) {
      width: 70%
    }
    .avatar { 
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin: -5px;
    }
    .user {
    padding: 12px;
    font-weight: bold;
    }
}

.publication__post {
   input {
       width: 70%;
       padding: 15px;
       border-radius:20px;
       border: 1px solid rgb(194, 194, 194);
       margin: 5px;
   }
   .publication__boutons {
       display: flex;
       justify-content: space-evenly;
   }
   button {
       border-radius: 20px;
       border:none;
       width: 40%;
       padding: 15px;
       margin: 5px;
       box-shadow: 5px 5px 10px #d4d4d4;
       font-size: 14px;
       font-weight: bold;
       background-color: rgb(172, 208, 226);
   }
}

.label__publi {
  border-radius: 20px;
  border:none;
  width: 40%;
  padding: 15px;
  margin: 5px;
  box-shadow: 5px 5px 10px #d4d4d4;
  font-weight: bold;
  background-color: rgb(172, 208, 226);
  text-align: center;
  font-size: 14px;
}

.input__image {
    display: none;
 }

.fil__post {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.post__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  @media screen and ( max-width: 770px ) {
    width: 100%;
  }
  .post {
    border: 1px solid rgb(194, 194, 194);
    width: 62%;
    @media screen and ( max-width: 320px ) {
      width: 70%;
    }
  }
}

.post__details {
    display: flex;
    justify-content: space-between;
    margin: 5px;
    .user__header {
    display: flex;
    }
    .post__image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin: 10px;
    }
    .post__user {
    padding: 5px;
    }
    i {
      padding : 10px;
    }
}

.publi {
    border: 1px solid rgb(194, 194, 194);
    width: 62%;
    @media screen and ( max-width: 320px ) {
      width: 70%;
    }
    .publi__details {
      margin: 10px;  
    }
    .publi__image {
      width: 100%;
      max-height: 400px;
    }
    i {
        padding : 10px;
    }
}

.comment__button {
   display: flex;
    justify-content: space-evenly;
    padding: 10px;
    @media screen and ( max-width:550px ) {
      display: flex;
      flex-direction: column;
    }
    .button__comment {
     margin: 5px;
     padding: 15px;
     border-radius: 20px;
     border: 1px solid rgb(194, 194, 194);
     width: 50%;
     @media screen and ( max-width:450px ) {
       width: 80%;
       font-size: 12px;
     }
    }
    .comment__create {
     border-radius: 20px;
     border:none;
     width: 35%;
     margin: 5px;
     box-shadow: 5px 5px 10px #d4d4d4;
     font-weight: bold;
     @media screen and ( max-width:550px ) {
     width: 90%;
     padding: 15px;
     margin-left: 10px;
    }
  }
}

.comment__user {
   display: flex;
  .comment__image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin: 15px;
  }
  i {
    padding-left:25px;
  }
}
</style>