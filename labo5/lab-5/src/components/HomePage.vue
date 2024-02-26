<template>
  <CreateTask :userId="userId" :addTask="addTask" />

  <h1>Tasks</h1>
  <ViewTask
    v-for="task of tasks"
    :task="task"
    :userId="userId"
    :onUpdateTasks="onUpdateTasks"
  />
</template>

<script>
import * as api from "../util/api.js";
import CreateTask from "./CreateTask.vue";
import ViewTask from "./ViewTask.vue";

export default {
  name: "HomePage",
  components: {
    CreateTask,
    ViewTask,
  },
  data() {
    return {
      tasks: [],
      userId: "",
    };
  },

  methods: {
    addTask(task) {
      this.tasks.push(task);
    },
    async onUpdateTasks() {
      this.tasks = await api.getTasks(this.userId);
      console.log(this.tasks);
    },
  },

  async created() {
    this.userId = await api.getUserId();
    this.tasks = await api.getTasks(this.userId);
    console.log(this.userId);
  },
};
</script>

<style scoped></style>
```
