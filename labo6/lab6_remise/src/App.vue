<template>
  <div id="app">
    <Forecast />
  </div>
</template>

<script>
import Forecast from "./components/Forecast.vue";

export default {
  name: "app",
  components: {
    Forecast,
  },
};
</script>
