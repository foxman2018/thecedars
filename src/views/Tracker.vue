<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Bill Tracker</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-dark-green" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

        <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating">

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="bill" placeholder="Enter name..." v-model="bill">
                    <label fid="bill">Bill Type</label>
                </div>
                <div class="form-floating">
                    <textarea class="form-control" id="details" style="height:100px;margin-bottom:16px" placeholder="Enter details..." v-model="details"></textarea>
                    <label for="details">Details</label>
                </div>
            </div><br/>
            <button class="add-button colour-dark-green right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="card colour-dark-green" v-for="payment in payments" :key="payment.id" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">receipt_long</span>
            </div>
            <div class="card-body">
                 <div class="noEdit" v-show="showEditId !== payment.id">
                    <h5 class="card-title">{{ payment.bill }}</h5><br/>
                    <p class="card-text">{{ payment.details }}</p><br/>
                    <button v-on:click="remove(payment.id)" class="btn">Remove</button>
                    <span v-on:click="toggleEdit(payment.id)" class="material-icons right">mode_edit</span>
                </div>

                <div class="showEdit" v-show="showEditId == payment.id"><br/>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="title" placeholder="Enter title..." v-model="payment.bill">
                        <label fid="title">Bill Type</label>
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" id="desc" style="height:100px" placeholder="Enter description..." v-model="payment.details"></textarea>
                        <label for="desc">Details</label>
                    </div><br/>
                    <a v-on:click="edit(payment.id, payment.bill, payment.details)" class="btn">Save edit</a>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-dark-green">
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
    name: 'Tracker',
    data() {
        return {
            payments: '',
            bill: '',
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
                .from('bill_payments')
                .select('*')
                .order('id', { ascending: true })
            this.payments = data
            this.loading = false
        },
        insert: async function() {
            const { error } = await supabase
            .from('bill_payments')
            .insert([
                { bill: `${this.bill}`, details: `${this.details}`}
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd
                this.bill = ''
                this.details = ''
                this.getData()
                this.notification = 'Bill Payment was added successfully!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        edit: async function(id, bill, details) {
            const { error } = await supabase
            .from('bill_payments')
            .update({ bill: bill, details: details })
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.showEditId = ''
                this.notification = 'Bill Payment successfully edited!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        }, 
        remove: async function(id) {
            const { error } = await supabase
            .from('bill_payments')
            .delete()
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Bill Payment removed!'
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