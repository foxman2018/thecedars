<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Birthdays</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-orange" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

         <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="name" placeholder="Enter name..." v-model="name">
                <label fid="title">Name</label>
            </div>
            <div class="form-floating mb-3">
                <input type="date" class="form-control" id="date" placeholder="Enter date..." v-model="date">
                <label fid="date">Birth date</label>
            </div><br/>
            <button class="add-button colour-orange right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="card colour-orange" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">cake</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">Next Birthday : {{ nextBirthday.name }}</h5>
                <p class="card-text">{{ nextBirthday.name }} will be <b>{{ currentYear - (nextBirthday.sort_date > currentDate ? nextBirthday.birth_year : nextBirthday.birth_year - 1)}}</b> on <b>{{ nextBirthdayDate }}</b></p>
            </div>
        </div>

        <hr/>
        <div class="row">
            <div class="col-md-6"  v-for="birthday in birthdays" :key="birthday.id" v-show="!loading">
                <div class="card colour-orange">
                    <div class="card-header">
                        <span class="material-icons">cake</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ birthday.name }}</h5>
                        <p class="card-text">{{ birthday.date_display }}<br/>Next birthday - {{ currentYear - (birthday.sort_date > currentDate ? birthday.birth_year : birthday.birth_year - 1)}} years old</p><br/>
                        <button v-on:click="remove(birthday.id)" class="btn">Remove</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-orange">
                <div class="card-body">
                    <span class="material-icons">cake</span>
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
    name: 'Birthdays',
    data() {
        return {
            birthdays: '',
            desc: '',
            name: '',
            date: '',
            nextBirthday: '',
            nextBirthdayDate: '',
            currentYear: '',
            loading: true,
            notification: ''
        }
    },
    mounted () {
        this.getData(),
        this.getNext()
    },
    methods: {
        getData: async function () {
            this.loading = true
            let d = new Date()
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            this.currentYear = ye
            this.currentDate = mon+da
            const { data } = await supabase
                .from('birthdays')
                .select('*')
                .order('sort_date', { ascending: true })
            this.birthdays = data
        },
        getNext: async function () {
            let d = new Date()
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            this.currentYear = ye
            this.currentDate = mon+da
            let current = `${mon}${da}`
            console.log(current)
            const { data } = await supabase
                .from('birthdays')
                .select('*')
                .gt('sort_date', current)
                .order('sort_date', { ascending: true })
            this.nextBirthday = data[0]
            console.log(this.nextBirthday)
            if (!this.nextBirthday) {
                this.nextBirthday = this.birthdays[0]
            }
            d = new Date(this.nextBirthday.date)
            mon = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
            da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            this.nextBirthdayDate = `${da} ${mon}`
            this.loading = false
        },
        insert: async function() {
            let d = new Date(this.date)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            this.date = `${da} ${mo} ${ye}`
            const { error } = await supabase
            .from('birthdays')
            .insert([
                { name: `${this.name}`, date_display: `${this.date}`, sort_date: `${mon}${da}`, birth_year: `${ye}` }
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.name = ''
                this.date = ''
                this.getData()
                this.notification = 'Birthday was added successfully!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        remove: async function(id) {
            const { error } = await supabase
            .from('birthdays')
            .delete()
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Birthday removed!'
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

</style>