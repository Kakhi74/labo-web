<template>
  <div>
    <h1>Weather.JS</h1>
    <h2>
      <span class="city">{{ city }}</span>
      <span>{{ state }}</span>
    </h2>
    <div class="days">
      <Day v-for="day in forecast" v-bind:day="day" v-bind:key="day.weekday" />
    </div>
  </div>
</template>

<script>
import * as api from "../api.js";
import Day from "./Day.vue";

export default {
  name: "ForecastIndex",
  components: {
    Day,
  },
  data: () => ({
    city: "",
    state: "",
    forecast: [],
  }),

  async created() {
    const { forecast, city, state } = await api.getForecast();
    this.city = city;
    this.state = state;
    this.forecast = [...forecast].slice(0, 7);
  },
};
</script>

<style>
.days {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}
</style>
