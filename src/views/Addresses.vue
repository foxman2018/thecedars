<template>

    <div class="container">
        <div class="row">

            <div class="col-9">
                <h4><b>Addresses</b></h4>
            </div>

            <div class="col-3 right">
                <button class="add-button colour-purple" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Add</button>
            </div>

        </div>

        <div class="add collapse" id="collapseForm"><br/>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="name" placeholder="Enter name..." v-model="name">
                <label fid="name">Name</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="line_1" placeholder="Enter address line 1..." v-model="line_1">
                <label fid="line_1">Address Line 1</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="line_2" placeholder="Enter address line 2..." v-model="line_2">
                <label fid="line_2">Address Line 2</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="line_3" placeholder="Enter address line 3..." v-model="line_3">
                <label fid="line_3">Address Line 3</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="town" placeholder="Enter address town..." v-model="town">
                <label fid="town">Address Town</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="county" placeholder="Enter address county..." v-model="county">
                <label fid="county">Address County</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="country" placeholder="Enter address country..." v-model="country">
                <label fid="country">Address Country</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="zip" placeholder="Enter address zip..." v-model="zip">
                <label fid="zip">Address Zip</label>
            </div><br/>
            <button class="add-button colour-purple right" v-on:click="insert()" data-bs-toggle="collapse" href="#collapseForm" role="button" aria-expanded="false" aria-controls="collapseForm">Save</button>
        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="card colour-purple" v-for="address in addresses" :key="address.id" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">place</span>
            </div>
            <div class="card-body">
                <div class="noEdit" v-show="showEditId !== address.id">
                    <h5 class="card-title">{{ address.address_name }}</h5>
                    <p class="card-text">{{ address.address_line_1 ? address.address_line_1 : '' }}<br v-if="address.address_line_1"/>
                    {{ address.address_line_2 ? address.address_line_2 : '' }}<br v-if="address.address_line_2"/>
                    {{ address.address_line_3 ? address.address_line_3 : '' }}<br v-if="address.address_line_3"/>
                    {{ address.address_town ? address.address_town : '' }}<br v-if="address.address_town"/>
                    {{ address.address_county ? address.address_county : '' }}<br v-if="address.address_county"/>
                    {{ address.address_country ? address.address_country : '' }}<br v-if="address.address_country"/>
                    {{ address.address_zip ? address.address_zip : '' }}</p><br/>
                    <button v-on:click="remove(address.id)" class="btn">Remove</button>
                    <span v-on:click="toggleEdit(address.id)" class="material-icons right">mode_edit</span>
                </div>


                <div class="showEdit" v-show="showEditId == address.id"><br/>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="name" placeholder="Enter name..." v-model="address.address_name">
                        <label fid="title">Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="line_1" placeholder="Enter address line 1..." v-model="address.address_line_1">
                        <label fid="line_1">Address Line 1</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="line_2" placeholder="Enter address line 2..." v-model="address.address_line_2">
                        <label fid="line_2">Address Line 2</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="line_3" placeholder="Enter address line 3..." v-model="address.address_line_3">
                        <label fid="line_3">Address Line 3</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="town" placeholder="Enter address town..." v-model="address.address_town">
                        <label fid="town">Address Town</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="county" placeholder="Enter address county..." v-model="address.address_county">
                        <label fid="county">Address County</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="country" placeholder="Enter address country..." v-model="address.address_country">
                        <label fid="country">Address Country</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="zip" placeholder="Enter address zip..." v-model="address.address_zip">
                        <label fid="zip">Address Zip</label>
                    </div><br/>
                    <a v-on:click="edit(address.id, address.address_name, address.address_line_1, address.address_line_2, address.address_line_3, address.address_town, address.address_county, address.address_country, address.address_zip)" class="btn">Save edit</a>
                </div>
            </div>
        </div>

        <div id="notification">
            <div class="card colour-purple">
                <div class="card-body">
                    <span class="material-icons">place</span>
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
    name: 'Addresses',
    data() {
        return {
            addresses: '',
            name: '',
            line_1: '',
            line_2: '',
            line_3: '',
            town: '',
            county: '',
            country: '',
            zip: '',
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
                .from('addresses')
                .select('*')
                .order('address_name', { ascending: true })
            this.addresses = data
            this.loading = false
        },
        insert: async function() {
            const { error } = await supabase
            .from('addresses')
            .insert([
                { address_name: `${this.name}`, address_line_1: `${this.line_1}`, address_line_2: `${this.line_2}`, address_line_3: `${this.line_3}`, address_town: `${this.town}`, address_county: `${this.county}`, address_country: `${this.country}`, address_zip: `${this.zip}` }
            ])
            if (error) {
                console.log(error)
            } else {
                this.showAdd = !this.showAdd,
                this.name = '',
                this.line_1 = '',
                this.line_2 = '',
                this.line_3 = '',
                this.town = '',
                this.county = '',
                this.country = '',
                this.zip = '',
                this.getData()
                this.notification = 'Address was added successfully!'
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
            .from('addresses')
            .delete()
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.notification = 'Address removed!'
                this.showNotification()
                setTimeout(() => {
                    this.hideNotification()
                }, 3000)
            }
        },
        edit: async function(id, name, line_1, line_2, line_3, town, county, country, zip) {
            const { error } = await supabase
            .from('addresses')
            .update(
                { address_name: name, address_line_1: line_1, address_line_2: line_2, address_line_3: line_3, address_town: town, address_county: county, address_country: country, address_zip: zip }
            )
            .match({ id: id })
            if (error) {
                console.log(error)
            } else {
                this.getData()
                this.showEditId = ''
                this.notification = 'Address successfully edited!'
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