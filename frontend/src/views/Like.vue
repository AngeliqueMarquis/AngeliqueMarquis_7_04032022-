/* Possible improvement, not yet put in the site */

<template>

</template>


<script>
    import axios from 'axios'

    
    export default {
        name: 'Likes',
        props:['post'],
        data(){
            return {
                userId: localStorage.getItem('userId'),
                notyf : new Notyf({
                    duration: 2000,
                    position: {
                        x: 'center',
                        y: 'top'
                    },
                    dismissible: true
                })
            }
        },
        mounted() {
            this.displayHeartColor();  
        },
        methods:{

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
                    this.postLikes = response.data;
                    
                    if(this.postLikes.length == 0) {
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
                        if(this.postLikes.find(x => x.userId == userId)) {
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
        }
    }
</script>


<style>

</style>