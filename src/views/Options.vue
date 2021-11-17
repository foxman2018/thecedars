<template>

<div class="container">

  <div class="row align-items-center">
    <div class="col-9">
        <p><b>{{day}}</b></p>
        <h4>{{date}} <b>{{month}}</b> {{year}}</h4>
        <p>{{weather}}</p>
    </div>
    <div class="col-3 right">
      <a href="https://www.windy.com/?53.174,-6.989,7">
        <span v-bind:class=" !dark ? 'material-icons' : 'material-icons-dark' ">{{weatherIcon}}</span>
      </a>
      <!-- <span v-if="!dark" v-on:click="toggleDarkMode()" class="material-icons">nightlight</span>
      <span v-if="dark" v-on:click="toggleDarkMode()" class="material-icons text-white">wb_sunny</span> -->
    </div>
  </div>

  <hr/>

  <div class="row">

    <div class="col-sm-6" v-if="clear">
      <router-link to="/clearsky">
        <div class="panel panel-option colour-green">
          <span class="material-icons">nightlight</span>
          <h4>Sky is clear tonight!</h4>
        </div>
      </router-link>
    </div>

    <div class="col-sm-6">
      <router-link to="/todos">
        <div class="panel panel-option colour-teal">
          <span class="material-icons">fact_check</span>
          <h4>To-Do List</h4>
        </div>
      </router-link>
    </div>

    <div class="col-sm-6">
        <router-link to="/events">
          <div class="panel panel-option colour-pink">
              <span class="material-icons">event</span>
              <h4>Upcoming Events</h4>
          </div>
        </router-link>
    </div>

    <div class="col-sm-6">
      <router-link to="/improvements">
        <div class="panel panel-option colour-red">
            <span class="material-icons">home</span>
            <h4>Home Improvements</h4>
        </div>
      </router-link>
    </div>

    <div class="col-sm-6">
      <router-link to="/ethan">
        <div class="panel panel-option colour-blue">
          <span class="material-icons">favorite</span>
          <h4>Ethan's List</h4>
        </div>
      </router-link>
    </div>

    <div class="col-sm-6">
      <router-link to="/addresses">
        <div class="panel panel-option colour-purple">
          <span class="material-icons">place</span>
          <h4>Addresses</h4>
        </div>
      </router-link>
    </div>

    <div class="col-sm-6">
      <router-link to="/birthdays">
        <div class="panel panel-option colour-orange">
            <span class="material-icons">cake</span>
            <h4>Birthdays</h4>
        </div>
      </router-link>
    </div>

    <div class="col-sm-6">
      <router-link to="/requests">
        <div class="panel panel-option colour-grey">
            <span class="material-icons">shopping_cart</span>
            <h4>Shopping Lists</h4>
        </div>
      </router-link>
    </div>

    <!-- <div class="col-sm-6" v-if="!clear">
      <router-link to="/clearsky">
        <div class="panel panel-option colour-grey">
          <span class="material-icons">wb_cloudy</span>
          <h4>Clear Sky Checker</h4>
        </div>
      </router-link>
    </div> -->

    <div class="col-sm-6">
      <router-link to="/tracker">
        <div class="panel panel-option colour-dark-green">
          <span class="material-icons">receipt_long</span>
          <h4>Bill Tracker</h4>
        </div>
      </router-link>
    </div>

  </div>

</div>

</template>

<script>
export default {
  name: 'Options',
  data() {
    return {
      day: '',
      date: '',
      month: '',
      year: '',
      weather: '',
      weatherIcon: '',
      clear: false,
      dark: ''
    }
  },
  created() {
      this.getNow()
      this.getWeather()
      this.getForecast()
      this.checkDarkMode()
  },
  methods: {
      getWeather: async function() {
          const d = new Date()
          const currentHour = d.getHours()
          const res = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${process.env.VUE_APP_LAT}&lon=${process.env.VUE_APP_LON}&appid=${process.env.VUE_APP_OPENWEATHERAPI}&units=metric`)
          const results = await res.json()
          const condition = results.list[0].weather[0].main
          this.weather = Math.round(results.list[0].main.temp)+'°c - '+results.list[0].weather[0].description
          if (condition == 'Clear' || condition == 'Sun' || results.list[0].clouds.all < 20) {
            if (currentHour > 20 || currentHour < 3) {
              this.weatherIcon = 'nightlight';
            } else {
              this.weatherIcon = 'wb_sunny';
            }
          } else if (condition == 'Rain') {
            this.weatherIcon = 'umbrella';
          } else if (condition == 'Snow') {
            this.weatherIcon = 'ac_unit';
          } else if (condition == 'Wind') {
            this.weatherIcon = 'air';
          } else {
            this.weatherIcon = 'wb_cloudy';
          }
      },
      getNow: function() {
            this.day = new Date().toLocaleString('en-us', {weekday:'long'})
            this.date = new Date().getDate()
            this.month = new Date().toLocaleString('en-us', {month:'long'})
            this.year = new Date().getFullYear()
      },
      getForecast: async function() {
            this.loading = true          
            const res = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${process.env.VUE_APP_LAT}&lon=${process.env.VUE_APP_LON}&appid=${process.env.VUE_APP_OPENWEATHERAPI}&units=metric`)
            const results = await res.json()
            const forecastArray = results.list

            const d = new Date()
            const currentHour = d.getHours()

            if (currentHour < 3) {
                this.result = forecastArray.slice(6,9);
            } else if (currentHour >= 3 && currentHour < 6) {
                this.result = forecastArray.slice(5,8);
            } else if (currentHour >= 6 && currentHour < 9) {
                this.result = forecastArray.slice(4,7);
            } else if (currentHour >= 9 && currentHour < 12) {
                this.result = forecastArray.slice(3,6);
            } else if (currentHour >= 12 && currentHour < 15) {
                this.result = forecastArray.slice(2,5);
            } else if (currentHour >= 15 && currentHour < 18) {
                this.result = forecastArray.slice(1,4);
            } else if (currentHour >= 18 && currentHour < 21) {
                this.result = forecastArray.slice(0,3);
            } else if (currentHour >= 21) {
                this.result = forecastArray.slice(7,10);
            }

            var j = 0;
            for (var i = 0; i < 3; i++) {
              
                // Checks if fully clear
                // if (this.result[i].weather[0].main === "Clear") {
                //     j = j + 1
                // }

                // Checks if clouds are less than 20%
                if (this.result[i].clouds.all < 20) {
                    j = j + 1
                }
            }

            if (j >= 2) {
                this.clear = true
            }
      },
      toggleDarkMode: function() {
        this.dark = !this.dark
        let app = document.getElementById("app")
        app.classList.toggle("dark-mode")
      },
      checkDarkMode: function() {
        let app = document.getElementById("app")
        if (app.classList.contains('dark-mode')) { this.dark = true } else { this.dark = false }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #2c3e50;
  text-decoration: none;
}

a:hover {
  color: #2c3e50;
  text-decoration: none;
}

.panel-option {
  padding: 20px 0px;
  text-align: center;
}

.material-icons {
  font-family: 'Material Icons';
  color: #333;
  opacity: .2;
  font-weight: normal;
  font-style: normal;
  font-size: 3em;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  margin-bottom: 20px;
  transition: all .2s ease-in-out;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}

.material-icons-dark {
  font-family: 'Material Icons';
  color: rgb(250, 250, 250);
  opacity: .2;
  font-weight: normal;
  font-style: normal;
  font-size: 3em;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  margin-bottom: 20px;
  transition: all .2s ease-in-out;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}

.small {
  font-size: 2em!important;
}

</style>