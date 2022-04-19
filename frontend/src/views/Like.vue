<template>
    <div class="like  fb-border fb-gray-bg mx--2">
        <i :id="post.id" @click="likePost()" class="fas fa-heart like__button" aria-label="Aimer le message"></i>
        <p v-if="post.like > 0" class="like__count">{{ User }}</p>
    </div>
</template>


<script>
    import axios from 'axios'
    export default {
        name: 'Like',
        props:['post'],
        data(){
            return {
                userId: localStorage.getItem('userId'),
            }
        },
        mounted() {
            this.displayHeartColor();  
        },
        methods:{
            // Permet d'aimer un message
            likePost() {
                const postId = this.post.id;
                const userId = this.userId;
                axios.get('http://localhost:3000/api/post/' + postId + '/like', {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    this.postLike = response.data;
                    
                    if(this.postLike.length == 0) {
                        this.like = false  
                        axios.post('http://localhost:3000/api/post/' + postId + '/like', {
                            like: this.like,
                        },{
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then(() => {
                            console.log("Vous aimez ce message !");
                            window.location.reload()
                        })
                        .catch(error => {
                            const msgerror = error.response.data
                            this.notyf.error(msgerror.error)
                        })
                    } else {                     
                        if(this.postLike.find(x => x.userId == userId)) {
                            this.like = true   
                            
                            axios.post('http://localhost:3000/api/post/' + postId + '/like', {
                                like: this.like,
                            },{
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                }
                            })
                            .then(() => {
                                console.log("Vous n'aimez plus ce message");
                                window.location.reload()
                            })
                            .catch(error => {
                                const msgerror = error.response.data
                                this.notyf.error(msgerror.error)
                            })
                        } else {
                            this.like = false   
                        
                            axios.post('http://localhost:3000/api/post/' + postId + '/like', {
                                like: this.like,
                            },{
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                }
                            })
                            .then(() => {
                                console.log("Vous aimez ce message !");
                                window.location.reload()
                            })
                            .catch(error => {
                                const msgerror = error.response.data
                                this.notyf.error(msgerror.error)
                            })
                        }
                    }
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            },

displayHeartColor(){
                const postId = this.post.id;
                const userId = localStorage.getItem('userId');
                axios.get('http://localhost:3000/api/post/' + postId + '/like', {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    this.postLike = response.data;
                                
                    if(this.postLike.find(x => x.userId == userId)) {
                        document.getElementById(this.post.id).classList = "fas fa-heart like__button postLiked"; 
                    } else {  
                        document.getElementById(this.post.id).classList = "far fa-heart like__button"; 
                    }
                })
                .catch(error => {
                    const msgerror = error.response.data
                    this.notyf.error(msgerror.error)
                })
            }
        }
    }
</script>


<style lang="scss">
    .like {
        width: auto;
        margin-right: -1rem;
        margin-left: -1em;
        padding: 1em;
        &__button:hover {
            color: #ff6363;
            cursor: pointer;
        }
        &__count {
            padding-left: 0.5rem;
        }
    }
    .postLiked {
        color:#ff6363;
    }
</style>