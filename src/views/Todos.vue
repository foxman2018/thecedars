<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>To-Do List</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-teal" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

        <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="title" placeholder="Enter title..." v-model="title">
                <label fid="title">Title</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control" id="desc" style="height:100px" placeholder="Enter description..." v-model="desc"></textarea>
                <label for="desc">Description</label>
            </div><br/>
            <button class="add-button colour-teal right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading"> 
        </div>

        <div class="card colour-teal" v-for="todo in todos" id="card" :key="todo.id" v-show="!loading && !todo.completed">
            <div class="card-header">
                <span class="material-icons">fact_check</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== todo.id">
                    <h5 class="card-title">{{ todo.title }}</h5>
                    <p class="card-text">{{ todo.description }}</p><br/>
                    <a v-show="!todo.completed" v-on:click="completed(todo.id)" class="btn">Mark as complete</a>
                    <span v-show="todo.completed" class="material-icons">check</span>
                    <span v-on:click="toggleEdit(todo.id)" class="material-icons right">mode_edit</span>
                </div>

                <div class="showEdit" v-show="showEditId == todo.id"><br/>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="title" placeholder="Enter title..." v-model="todo.title">
                        <label fid="title">Title</label>
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" id="desc" style="height:100px" placeholder="Enter description..." v-model="todo.description"></textarea>
                        <label for="desc">Description</label>
                    </div><br/>
                    <a v-on:click="edit(todo.id, todo.title, todo.description)" class="btn">Save edit</a>
                </div>
            </div>
        </div>

        <div class="row" v-show="!showCompleted && !loading">

            <div class="col-12 center">
                <button v-on:click="toggleCompleted()" class="add-button colour-teal">Show Completed</button>
            </div>

        </div>

        <hr v-show="showCompleted"/>

        <div class="card colour-teal completed" v-for="todo in completedTodos" id="card" :key="todo.id" v-show="showCompleted">
            <div class="card-header">
                <span class="material-icons">fact_check</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== todo.id">
                    <h5 class="card-title">{{ todo.title }}</h5>
                    <p class="card-text">{{ todo.description }}</p><br/>
                    <span v-show="todo.completed" class="material-icons">check</span>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-teal">
                <div class="card-body">
                    <span class="material-icons">fact_check</span>
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
    name: 'Todo',
    data() {
        return {
            todos: '',
            title: '',
            desc: '',
            showEditId: '',
            loading: true,
            notification: '',
            showCompleted: false,
            completedTodos: {}
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData: async function () {
            this.loading = true
            const { data } = await supabase
                .from('todo')
                .select('*')
                .order('completed', { ascending: true })
                .order('id', { ascending: true })
            this.todos = data
            this.loading = false
            this.completedTodos = Object.values(this.todos).filter(todo => todo.completed === 1)
        },
        insert: async function() {
            const { error } = await supabase
            .from('todo')
            .insert([
                { 
                    title: `${this.title}`, 
                    description: `${this.desc}` 
                }
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.title = ''
                this.desc = ''
                this.getData()
                this.notification = 'To-Do was added successfully!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        toggleEdit: function(id) {
            this.showEditId = id
        },
        completed: async function(id) {
            const { error } = await supabase
            .from('todo')
            .update({ completed: 1 })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'To-Do removed!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        edit: async function(id, title, desc) {
            const { error } = await supabase
            .from('todo')
            .update({ title: title, description: desc })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.showEditId = ''
                this.notification = 'To-Do successfully edited!'
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
        toggleCompleted: function() {
            this.showCompleted = !this.showCompleted
        },
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