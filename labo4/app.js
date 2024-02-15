import * as api from "./api.js";

const nameInput = document.querySelector("#name");
const createButton = document.querySelector("#create");
const taskContainer = document.querySelector("#tasks");

let tasks = [];

api.getTasks().then((res) => {
  console.log("fetching tasks", res);
  tasks = res;
});

createButton.onclick = () => {
  api.postTask(nameInput.value).then((task) => {
    console.log("Create task", task);
    tasks.push(task);
    renderTasks();
  });
};

const renderTasks = () => {
  taskContainer.innerHTML = "";
  tasks.forEach((task, idx) => {
    const taskElement = document.createElement("div");

    const taskTextArea = document.createElement("textarea");
    taskTextArea.value = task.name;
    taskElement.appendChild(taskTextArea);

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";

    updateButton.onclick = () => {
      api.putTask(taskTextArea.value, task.id).then((task) => {
        console.log("update task", task);
        tasks[idx].name = task.name;
        renderTasks();
      });
    };
    taskElement.appendChild(updateButton);

    const destroyTaskButton = document.createElement("button");
    destroyTaskButton.textContent = "Delete";

    destroyTaskButton.onclick = () => {
      api.delTask(task.id).then(() => {
        console.log("delete task ", task.id);
        tasks.splice(idx, 1);
        renderTasks();
      });
    };
    taskElement.appendChild(destroyTaskButton);

    taskContainer.appendChild(taskElement);
  });
};
