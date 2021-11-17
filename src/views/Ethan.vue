<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Ethan's List</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-blue" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

        <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="title" placeholder="Enter title..." v-model="title">
                <label fid="title">Name</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control" id="details" style="height:100px" placeholder="Enter details..." v-model="desc"></textarea>
                <label for="details">Description</label>
            </div><br/>
            <button class="add-button colour-blue right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div v-bind:class = "(item.purchased)?'card colour-blue purchased':'card colour-blue'" v-for="item in items" :key="item.id" v-show="!loading && !item.purchased">
            <div class="card-header">
                <span class="material-icons">favorite</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== item.id">
                    <h5 class="card-title">{{ item.title }}</h5>
                    <p class="card-text">{{ item.description }}</p><br/>
                    <a v-show="!item.purchased" v-on:click="purchased(item.id)" class="btn">Mark as purchased</a>
                    <span v-show="item.purchased" class="material-icons">check</span>
                    <span v-on:click="toggleEdit(item.id)" class="material-icons right">mode_edit</span>
                </div>

                <div class="showEdit" v-show="showEditId == item.id"><br/>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="title" placeholder="Enter title..." v-model="item.title">
                        <label fid="title">Name</label>
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" id="details" style="height:100px" placeholder="Enter details..." v-model="item.description"></textarea>
                        <label for="details">Description</label>
                    </div><br/>
                    <a v-on:click="edit(item.id, item.title, item.description)" class="btn">Save edit</a>
                </div>

            </div>
        </div>

        <div class="row" v-show="!showPurchased && !loading">

            <div class="col-12 center">
                <button v-on:click="togglePurchased()" class="add-button colour-blue">Show Purchased</button>
            </div>

        </div>

        <hr v-show="showPurchased"/>

        <div class="card colour-blue purchased" v-for="item in purchasedItems" id="card" :key="item.id" v-show="showPurchased">
            <div class="card-header">
                <span class="material-icons">fact_check</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== item.id">
                    <h5 class="card-title">{{ item.title }}</h5>
                    <p class="card-text">{{ item.description }}</p><br/>
                    <span v-show="item.purchased" class="material-icons">check</span>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-blue">
                <div class="card-body">
                    <span class="material-icons">favorite</span>
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
    name: 'Ethan',
    data() {
        return {
            items: '',
            title: '',
            desc: '',
            showEditId: '',
            loading: true,
            notification: '',
            showPurchased: false,
            purchasedItems: {}
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData: async function () {
            this.loading = true
            const { data } = await supabase
                .from('ethans_list')
                .select('*')
                .order('purchased', { ascending: true })
                .order('id', { ascending: true })
            this.items = data
            this.loading = false
            this.purchasedItems = Object.values(this.items).filter(item => item.purchased === 1)
        },
        insert: async function() {
            const { error } = await supabase
            .from('ethans_list')
            .insert([
                { title: `${this.title}`, description: `${this.desc}`}
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.title = ''
                this.desc = ''
                this.getData()
                this.notification = 'Item was added successfully!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        toggleEdit: function(id) {
            this.showEditId = id
        },
        purchased: async function(id) {
            const { error } = await supabase
            .from('ethans_list')
            .update({ purchased: 1 })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Item purchased!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        edit: async function(id, title, desc) {
            const { error } = await supabase
            .from('ethans_list')
            .update({ title: title, description: desc })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.showEditId = ''
                this.notification = 'Item successfully edited!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        showNotification: function() {
            var elem = document.querySelector('#notification')
            elem.style.bottom = '30px'
        },
        hideNotification: function() {
            var elem = document.querySelector('#notification')
            elem.style.bottom = '-300px'
        },
        togglePurchased: function() {
            this.showPurchased = !this.showPurchased
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.material-icons {
    font-size: 2em;
}

.card span.right {
    float: right;
}

.purchased {
    opacity: .5
}

</style>