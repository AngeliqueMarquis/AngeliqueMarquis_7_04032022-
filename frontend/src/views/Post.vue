<template>
 <div>
  <Header />
    <div class="panel profile-info d-flex flex-column align-items-center mt-5">
      <img :src="image" class="rounded-circle" width="60" alt="photo de profil"><span class="user"> {{ firstname }} {{ lastname }}</span>
      <form>
        <textarea v-model="content" class="form-control input-lg p-text-area border border-secondary mt-3 " rows="4" placeholder="Votre texte.."></textarea>
      </form>
      <footer class="panel-footer">
        <button @click="createPost()" type="button" class="btn btn-color pull-right m-3" id="color">Publier</button>
        <label for="file" class="btn btn-color pull-left m-3" id="color">Ajouter un fichier</label>
        <input type="file" accept="image/*" id="file" class="d-none" v-on:change="uploadImage">
      </footer>
    </div>

    <div class="panel  d-flex flex-column align-items-center" v-for="post in posts" :key="post.id">
          <div class=" size__width mt-5">
              <div class="fb-user-thumb ">
                  <img :src="post.User.image" alt="photo de profil" >
              </div>
              <div class="fb-user-details">
                  <h3>{{ post.User.firstname }} {{ post.User.lastname }}</h3>
                  <p>le {{ postDate(post.createdAt) }}</p>
              </div>

              <div class="clearfix d-flex justify-content-end">
                <i v-if="post.userId == userId || userId ==='1'"  @click="deletePost(post.id)" class="fa fa-trash"></i>
              </div>
              <p class="fb-user-status">{{ post.content }}
              </p>

              <div class="fb-status-container fb-border">
                  <img class="publi__image" :src="post.image">
              </div>
        
        
              <div class="fb-status-container fb-border fb-gray-bg">      
                  <ul class="fb-comments">
                      <li class="d-flex" >

                          <div class="cmt-form">
                              <textarea v-model="comment" class="form-control" placeholder="Votre commentaire..." name=""></textarea>
                              <button class="btn btn-color" id="color" @click="createComment(post.id)">Commenter</button>
                          </div>
                      </li>

                      <li v-for="comment in comments" :key="comment.id">
                        <div class="fb-user-thumb">
                          <img :src="comment.User.image"  alt="photo de profil" width="50" class="rounded-circle">
                        </div>
                        <div class="fb-user-details">
                          <h3>{{ comment.User.firstname}} {{ comment.User.lastname }}</h3>
                          <p>{{ postDate(comment.createdAt) }} </p>
                        </div>
                        <div class="clearfix d-flex justify-content-end">
                          <i v-if="comment.userId == userId || userId ==='1'" @click="deleteComment(comment.id)" class="fa fa-trash"></i>
                        </div> 
                        <div class="cmt-details">
                          <p>{{ comment.textComment }}</p>
                        </div>
                      </li>
                      
                      
                  </ul>
                  
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
       console.log(response);
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

<style > 
body {
    color: #797979;
    background: white;
    font-family: 'Open Sans', sans-serif;
    padding: 0px !important;
    margin: 0px !important;
    font-size: 13px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    margin-top:20px;
}
.cover-photo {
    position: relative;
}
a:hover{
    text-decoration:none;    
}
.fb-timeline-img img {
    width: 100%;
height:auto;
max-height:280px;
    border-radius: 4px 4px 0 0;
    -webkit-border-radius: 4px 4px 0 0;
}
.profile-thumb img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    margin-top: -90px;
    border: 3px solid #fff;
}
.profile-info .panel-footer ul li a {
    color: #7a7a7a;
}
.profile-thumb {
    float: left;
    position: relative;
}
.p-text-area, .p-text-area:focus {
    border: none;
    font-weight: 300;
    box-shadow: none;
    color: black;
    font-size: 16px;
    margin-right: 26em;
}
#color{
  background-color: #ffd7d7;
  border-color: #ffd7d7;
}
.fb-user-mail {
    margin: 10px 0 0 20px;
    display: inline-block;
}
.fb-name  {
    bottom: 5px;
    left: 175px;
    position: absolute;
}
.fb-name h2 a {
    color: #FFFFFF;
    text-rendering: optimizelegibility;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
    font-size: 25px;
}
.fb-user-thumb {
    float: left;
    width: 70px;
    margin-right:15px;
}
.fb-user-thumb img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
}
.fb-user-details h3 {
    margin: 15px 0 0;
    font-size: 18px;
    font-weight:800;
}
.fb-user-details p {
    color: #c3c3c3;
}
.fb-user-status {
    padding: 10px 0;
    line-height: 20px;
}
.fb-time-action {
    padding: 15px 0;
}
.fb-border {
    border-top:1px solid #ebeef5;
}
.fb-time-action span, .fb-time-action a {
    margin-right: 5px;
}
.fb-time-action a {
    color: #2972a1;
}
.fb-time-action a:hover {
    text-decoration: underline;
}
.fb-time-action span {
    color: #5a5a5a;
}
.fb-status-container, .fb-comments li {
    margin: 0 -15px 0 -15px;
    padding: 0 15px;
}
.fb-gray-bg {
    background: #f6f6f6;
}
.fb-comments li {
    border-top:1px solid #ebeef5;
    padding: 15px;
}
.fb-comments .cmt-thumb  {
    width: 50px;
    float: left;
    margin-right: 15px;
}
.fb-comments .cmt-thumb img {
    width: 50px;
}
.fb-comments .cmt-details {
    padding-top: 5px;
}
.fb-comments .cmt-details a  {
    font-size: 14px;
    font-weight: bold;
}
.fb-comments .cmt-details a.like-link {
    font-size: 12px;
    font-weight: normal;
}
.cmt-form {
    display: flex;
    width: 90%;
}
.cmt-form textarea{
    height: 50px;
    line-height: 35px;
}
.fb-timeliner h2 {
    background: #828283;
    color: #fff;
    margin-top: 0;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    font-weight: 300;
}
.fb-timeliner ul {
    margin-left:15px;
    margin-bottom: 20px;
    list-style-type:none;
}
.fb-comments{
    list-style-type:none;
}
.fb-timeliner ul li {
    margin-bottom: 3px;
}
.fb-timeliner ul li a{
    color: #999797;
    border-left: 4px solid #d3d7dd;
    padding-left:10px;
    padding-top: 3px;
    padding-bottom: 3px;
    display: block;
}
.fb-timeliner ul li a:hover{
    color: #999797;
    border-left: 4px solid #b1b1b1;
    padding-left:10px;
}
.fb-timeliner ul li.active a{
    color: #7a7a7a;
    border-left: 4px solid #7a7a7a;
    padding-left:10px;
}
.recent-highlight {
    background: #FF6C60 !important;
}
.color {
  background-color: #E58B78;
  border-color: #E58B78 ;
}
.p textarea {
  width: 150px;
  color: Black;
}
.user {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size:x-large;
} 
.publi__image {
  max-width: 100%;
}
.size__width {
  width: 70%;
}
</style>