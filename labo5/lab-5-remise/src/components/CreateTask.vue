<template>
  <div>
    <p>New Task</p>
    <textarea v-model="taskName"></textarea>
    <button @click="createTask">Create Task</button>
  </div>
</template>

<script>
import * as api from "../util/api.js";

export default {
  name: "CreateTask",
  data() {
    return {
      taskName: "Value",
    };
  },

  props: ["userId", "addTask"],

  methods: {
    async createTask() {
      const newTask = await api.postTask(this.userId, this.taskName);
      this.taskName = "";
      this.addTask(newTask);
    },
  },

  async created() {
    this.tasks = await api.getTasks(this.userId);
  },
};
</script>

<style scoped></style>
