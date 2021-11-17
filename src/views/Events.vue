<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Upcoming Events</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-pink" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

         <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="name" placeholder="Enter name..." v-model="name">
                <label fid="title">Name</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control" id="details" style="height:100px;margin-bottom:16px" placeholder="Enter details..." v-model="details"></textarea>
                <label for="details">Details</label>
            </div>
            <div class="form-floating mb-3">
                <input type="date" class="form-control" id="date" placeholder="Enter date..." v-model="date">
                <label fid="date">Date</label>
            </div>
            <div class="form-floating mb-3">
                <input type="time" class="form-control" id="time" placeholder="Enter time..." v-model="time">
                <label fid="time">Time</label>
            </div><br/>
            <button class="add-button colour-pink right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="card colour-pink" v-for="event in events" :key="event.id" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">event</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== event.id">
                    <h5 class="card-title">{{ event.name }}</h5>
                    <p class="card-text">{{ event.details }}</p>
                    <p class="card-text"><i>{{ event.date_display }}<span v-if="event.time"> @ {{ event.time }}</span></i></p><br/>
                    <button v-on:click="remove(event.id)" class="btn">Remove</button>
                    <span v-on:click="toggleEdit(event.id)" class="material-icons right">mode_edit</span>
                </div>


                <div class="showEdit" v-show="showEditId == event.id"><br/>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="name" placeholder="Enter name..." v-model="event.name">
                        <label fid="title">Name</label>
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" id="details" style="height:100px;margin-bottom:16px" placeholder="Enter details..." v-model="event.details"></textarea>
                        <label for="details">Details</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="date" placeholder="Enter date..." v-model="event.date">
                        <label fid="date">Date</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="time" class="form-control" id="time" placeholder="Enter time..." v-model="event.time">
                        <label fid="time">Time</label>
                    </div><br/>
                    <a v-on:click="edit(event.id, event.title, event.details, event.date, event.time)" class="btn">Save edit</a>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-pink">
                <div class="card-body">
                    <span class="material-icons">event</span>
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
    name: 'Events',
    data() {
        return {
            events: '',
            details: '',
            name: '',
            date: '',
            time: '',
            date_display: '',
            currentDate: '',
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
            let d = new Date()
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            let currentDate = `${ye}${mon}${da}`
            const { data } = await supabase
                .from('events')
                .select('*')
                .gt('sort_date', currentDate)
                .order('sort_date', { ascending: true })
            this.events = data
            this.loading = false
        },
        insert: async function() {
            let d = new Date(this.date)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            this.date_display = `${da} ${mo} ${ye}`
            const { error } = await supabase
            .from('events')
            .insert([
                { name: `${this.name}`, date: `${this.date}`, date_display: `${this.date_display}`, sort_date: `${ye}${mon}${da}`, details: `${this.details}`, time: `${this.time}` }
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.name = ''
                this.date_display = ''
                this.date = ''
                this.time = ''
                this.details = ''
                this.getData()
                this.notification = 'Event was added successfully!</'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        toggleEdit: function(id) {
            this.showEditId = id
        },
        remove: async function(id) {
            const { error } = await supabase
            .from('events')
            .delete()
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Event removed!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        edit: async function(id, title, details, date, time) {
            let d = new Date(date)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            this.date = `${da} ${mo} ${ye}`
            const { error } = await supabase
            .from('events')
            .update({ title: title, details: details, date_display: this.date, sort_date: `${ye}${mon}${da}`, time: time })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.showEditId = ''
                this.notification = 'Event successfully edited!'
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

</style>