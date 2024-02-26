<template>
  <div>
    <textarea v-model="taskName"></textarea>
    <button @click="updateTask()">Update</button>
    <button @click="deleteTask()">Delete</button>
  </div>
</template>

<script>
import * as api from "../util/api.js";

export default {
  name: "ViewTask",
  data() {
    return {
      taskName: "",
    };
  },

  props: ["task", "userId", "onUpdateTasks"],

  methods: {
    async deleteTask() {
      await api.delTask(this.userId, this.task.id);
      this.onUpdateTasks();
    },
    async updateTask() {
      await api.putTask(this.userId, this.taskName, this.task.id);
      this.onUpdateTasks();
    },
  },
  created() {
    this.taskName = this.task.name;
  },
};
</script>

<style scoped></style>
```
