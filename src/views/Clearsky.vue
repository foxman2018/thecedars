<template>

    <div class="container">
        <div class="row">

            <div class="col-md-9">
                <h4><b>Clear Sky Checker</b></h4>
            </div>

        </div>

        <hr/>

        <div class="loader">
            <img src="../assets/loader.gif" alt="loader" v-show="loading">
        </div>

        <div class="card colour-green" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">wb_sunny</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Weather Details</h5>
                        <p class="card-text" v-for="forecast in result" :key="forecast.dt">
                            {{forecast.dt_txt}}<br/>
                            Conditions : <b>{{forecast.weather[0].description}}</b><br/>
                            Temp : <b>{{forecast.main.temp}}°c</b><br/>
                            Cloud Cover : <b>{{forecast.clouds.all}}%</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div class="card colour-green" v-show="!loading">
            <div class="card-header">
                <span class="material-icons">nightlight</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6" v-if="lunar.moonPhase">
                        <h5>Lunar Details</h5>
                        <p>
                            Phase : <b>{{ lunar.moonPhase }}</b><br/>
                            Illumination : <b>{{ illumination }}</b><br/><br/>
                            Moon Rise : <b>{{ lunar.moonRise }}</b><br/>
                            Moon Set : <b>{{ lunar.moonSet }}</b><br/><br/>
                            Sun Set : <b>{{ lunar.sunRise }}</b><br/>
                            Sun Set : <b>{{ lunar.sunSet }}</b><br/>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>

export default {
name: 'Clearsky',
  data() {
    return {
      result: '',
      lunar: '',
      illumination: '',
      loading: true
    }
  },
  created() {
      this.getForecast()
  },
  methods: {
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

            this.getLunarData()
      },
      getLunarData: async function() {
            let d = new Date()
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            let mon = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            let currentDate = `${ye}${mon}${da}`
            const res = await fetch(`https://api.solunar.org/solunar/${process.env.VUE_APP_LAT},${process.env.VUE_APP_LON},${currentDate},0`)
            const result = await res.json()
            this.lunar = result
            this.illumination = Math. round(result.moonIllumination * 100) + '%'
            this.loading = false
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