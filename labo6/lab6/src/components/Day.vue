<template>
  <div class="day">
    <div class="weekday">
      {{ day.weekday }}
    </div>
    <img :src="`https://www.weatherbit.io/static/img/icons/${day.icon}.png`" />
    <div class="temperature">
      <span style="color: grey">{{ day.high }}</span>
      <span>{{ day.low }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DayItem",
  props: ["day"],
};
</script>
