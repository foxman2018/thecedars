<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Shopping Lists</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-grey" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

        <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating">

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="name" placeholder="Enter name..." v-model="name">
                    <label fid="name">Name</label>
                </div>
                <div class="form-floating">
                    <textarea class="form-control" id="details" style="height:100px;margin-bottom:16px" placeholder="Enter details..." v-model="details"></textarea>
                    <label for="details">Details</label>
                </div>
            </div><br/>
            <button class="add-button colour-grey right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="card colour-grey" v-for="request in requests" :key="request.id" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">shopping_cart</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== request.id">
                    <h5 class="card-title">{{ request.name }}</h5><br/>
                    <p class="card-text">{{ request.details }}</p><br/>
                    <button v-on:click="remove(request.id)" class="btn">Remove</button>
                    <span v-on:click="toggleEdit(request.id)" class="material-icons right">mode_edit</span>
                </div>

                <div class="showEdit" v-show="showEditId == request.id"><br/>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="title" placeholder="Enter name..." v-model="request.name">
                        <label fid="title">Name</label>
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" id="desc" style="height:100px" placeholder="Enter details..." v-model="request.details"></textarea>
                        <label for="desc">Details</label>
                    </div><br/>
                    <a v-on:click="edit(request.id, request.name, request.details)" class="btn">Save edit</a>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-grey">
                <div class="card-body">
                    <span class="material-icons">shopping_cart</span>
                    <p class="card-text"> {{ notification }}</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script>

import { createClient } from '@supabase/supabase-js'
const supabase = createClient([process.env.VUE_APP_DBLINK], [process.env.VUE_APP_DBCODE])

export default {
    name: 'Improvements',
    data() {
        return {
            requests: '',
            name: '',
            details: '',
            showEditId: '',
            loading: true,
            notification: ''
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData: async function () {
            this.loading = true
            const { data } = await supabase
                .from('shopping_request')
                .select('*')
                .order('id', { ascending: true })
            this.requests = data
            this.loading = false
        },
        insert: async function() {
            const { error } = await supabase
            .from('shopping_request')
            .insert([
                { name: `${this.name}`, details: `${this.details}`}
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.name = ''
                this.details = ''
                this.getData()
                this.notification = 'Shopping item was added successfully!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        edit: async function(id, name, details) {
            const { error } = await supabase
            .from('shopping_request')
            .update({ name: name, details: details })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.showEditId = ''
                this.notification = 'Shopping item successfully edited!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        }, 
        remove: async function(id) {
            const { error } = await supabase
            .from('shopping_request')
            .delete()
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Shopping item removed!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        toggleEdit: function(id) {
            this.showEditId = id
        },
        showNotification: function() {
            var elem = document.querySelector('#notification')
            elem.style.bottom = '30px'
        },
        hideNotification: function() {
            var elem = document.querySelector('#notification')
            elem.style.bottom = '-300px'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.material-icons {
    font-size: 2em;
}

</style>