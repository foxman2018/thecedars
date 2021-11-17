<template>
  <div class="container">
    <Header />
    <Footer />
  </div>
</template>

<script>

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  created() {
      this.checkDarkMode()
  },
  methods: {
    checkDarkMode: function() {
      const d = new Date()
      const currentHour = d.getHours()
      let app = document.getElementById("app")

      if (currentHour > 19 || currentHour < 7) {
        app.classList.add("dark-mode")
      }
    }
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #fff;
  padding: 30px 0px;
  transition: all .2s ease-in-out;
  min-height: 100vh;
}

.dark-mode {
  color: #fff!important;
  background-color: #272829!important;
}

.dark-mode-text {
  color: #494a4b!important;
}

.form-control {
    color: #212529;
    background-color: #eee;
    border: 0;
    opacity: .8;
}

.form-floating>label {
    color: #212529;
}

.panel {
  background-color: #eee;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  -webkit-box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27); 
  box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27);
  transition: all .2s ease-in-out;
  cursor: pointer;
  text-transform: capitalize;
}

.add-button {
  border-radius: 5px;
  padding: 10px 15px;
  border: none;
  transition: all .2s ease-in-out;
}

.add-button:hover {
  -webkit-box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27); 
  box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27);
}

.panel-icon {
  background-color: #2c3e50;
  opacity: .4;
  border-radius: 50%;
}

.panel-icon .material-icons {
  color: #fff;
}

.colour-red {
  background-color: rgba(245, 188, 188, 0.75);
}

.colour-blue {
  background-color: rgb(173, 211, 233, 0.75);
}

.colour-dark-green {
  background-color: rgba(140, 175, 149, 0.75);
}

.colour-green {
  background-color: rgb(170, 231, 168, 0.75);
}

.colour-purple {
  background-color: rgb(200, 168, 214, 0.75);
}

.colour-teal {
  background-color: rgb(183, 240, 240, 0.75);
}

.colour-orange {
  background-color: rgb(247, 217, 162, 0.75);
}

.colour-pink {
  background-color: rgb(247, 192, 252, 0.75);
}

.colour-grey {
  background-color: rgb(214, 214, 214, 0.75);
}

.colour-lavendar {
  background-color: rgba(155, 110, 185, 0.747);
}

.text-green {
  color: rgb(170, 231, 168);
}

.text-white {
  color: #fff;
}

.list {
    align-items: center;
}

.delete {
    color: rgb(250, 96, 96);
}

.right {
    text-align: right;
}

.center {
  text-align: center;
}

.margin-right {
    margin-right: 15px;
}

.card {
    color: #2c3e50;
    border: none;
    margin-bottom: 20px;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27); 
    box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27);
    transition: all .2s ease-in-out;
}

.card .material-icons {
    color: #6e6e6e;
    opacity: .3;
}

.btn {
  background-color: #6e6e6e;
  opacity: .6;
  color: #eee;
  border: none;
}

.loader {
  margin: 20px auto;
  opacity: .1;
  text-align: center;
}

.loader img {
  max-width: 100%;
}

.card span.right {
    float: right;
    cursor: pointer;
}

#notification {
    position: fixed;
    bottom: -300px;
    left: 50%;
    transform: translate(-50%, 0);
    transition: all .3s ease-in-out;
}

#notification .card {
    position: relative;
    width: 100%;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27); 
    box-shadow: 1px 1px 10px 2px rgba(117,117,117,0.27);
}

#notification .card-body {
    display: flex;
}

#notification .card-text {
    align-self: center;
    margin-left: 10px;
}

.card-title, .card-text {
  white-space: pre-line;
}

</style>
