<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Home Improvements</b></h4>
                <h6>Total : €{{total}}</h6>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-red" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

        <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="title" placeholder="Enter description..." v-model="desc">
                <label fid="title">Description</label>
            </div>
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="cost" placeholder="Enter cost..." v-model="cost">
                <label fid="cost">Cost</label>
            </div><br/>
            <button class="add-button colour-red right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="row">
            <div class="col-md-6" v-for="improvement in improvements" :key="improvement.id" v-show="!loading && !improvement.completed">
                <div class="card colour-red">
                    <div class="card-header">
                        <span class="material-icons">home</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ improvement.description }}</h5>
                        <p class="card-text">Cost : €{{ improvement.cost }}</p><br/>
                        <button v-on:click="completed(improvement.id)" class="btn">Mark as complete</button>
                        <span v-on:click="remove(improvement.id)" class="material-icons right">delete</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-show="!showPurchased && !loading">

            <div class="col-12 center">
                <button v-on:click="togglePurchased()" class="add-button colour-red">Show Purchased</button>
            </div>

        </div>

        <hr v-show="showPurchased"/>

        <div class="col-md-12" v-show="showPurchased">
            <h6>Completed : €{{completedTotal}}</h6>
        </div>

        <div class="row">
            <div class="col-md-6" v-for="improvement in completedImprovements" :key="improvement.id" v-show="!loading && showPurchased">
                <div class="card colour-red completed">
                    <div class="card-header">
                        <span class="material-icons">home</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ improvement.description }}</h5>
                        <p class="card-text">Cost : €{{ improvement.cost }}</p><br/>
                        <span v-show="improvement.completed == 1" class="material-icons">check</span>
                        <span v-on:click="remove(improvement.id)" class="material-icons right">delete</span>
                    </div>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-red">
                <div class="card-body">
                    <span class="material-icons">home</span>
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
            improvements: '',
            completedImprovements: '',
            total: '',
            completedTotal: '',
            desc: '',
            cost: '',
            loading: true,
            notification: '',
            showPurchased: false
        }
    },
    mounted () {
        this.getData()
        this.getCompleted()
    },
    methods: {
        getData: async function () {
            this.loading = true
            const { data } = await supabase
                .from('home_improvement')
                .select('*')
                .eq('completed', 0)
                .order('cost', { ascending: false })
            this.improvements = data
            this.total = this.improvements.reduce((n, {cost}) => n + cost, 0)
            this.loading = false
        },
        getCompleted: async function () {
            const { data } = await supabase
                .from('home_improvement')
                .select('*')
                .eq('completed', 1)
                .order('cost', { ascending: false })
            this.completedImprovements = data
            this.completedTotal = this.completedImprovements.reduce((n, {cost}) => n + cost, 0)
            this.loading = false
        },
        insert: async function() {
            const { error } = await supabase
            .from('home_improvement')
            .insert([
                { 
                    description: `${this.desc}`, 
                    cost: `${this.cost}`
                }
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.desc = ''
                this.cost = ''
                this.getData()
                this.notification = 'Home improvement was added successfully!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        completed: async function(id) {
            const { error } = await supabase
            .from('home_improvement')
            .update({ completed: 1 })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.getCompleted()
                this.notification = 'Home improvement completed!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        remove: async function(id) {
            const { error } = await supabase
            .from('home_improvement')
            .delete()
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Home improvement removed!'
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

.completed {
    opacity: .5
}

</style>