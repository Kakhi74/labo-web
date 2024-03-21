const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");

const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "UPDATE"],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
const port = 8080;

const users = [];
const tasks = [];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/users", (req, res) => {
  const userId = v4();
  users.push(userId);
  return res.status(200).send(JSON.stringify({ id: userId }));
});

const validateUserExists = (userId, res, callback) => {
  if (users.includes(userId)) {
    callback();
  } else {
    return res.status(404).send(`User with id ${userId} not found`);
  }
};

const validateTask = (taskName, res, callback) => {
  if (!taskName) {
    return res.status(400).send(`Invalid task name provided: ${taskName}`);
  } else {
    callback();
  }
};

const validateTaskExists = (taskId, res, callback) => {
  if (tasks.find((value) => value.id === taskId)) {
    callback();
  } else {
    return res.status(404).send(`Task with id ${taskId} not found`);
  }
};

app.get("/:userId/tasks", (req, res) => {
  const userId = req.params.userId;

  validateUserExists(userId, res, () => {
    return res.status(200).send({ tasks: tasks });
  });
});

app.put("/:userId/tasks/:taskId", (req, res) => {
  const userId = req.params.userId;
  const taskId = req.params.taskId;
  const taskName = req.body.name;

  validateUserExists(userId, res, () => {
    validateTaskExists(taskId, res, () => {
      validateTask(taskName, res, () => {
        const index = tasks.findIndex((value) => value.id === taskId);
        tasks[index].name = taskName;
        return res.status(200).send(JSON.stringify(tasks[index]));
      });
    });
  });
});

app.post("/:userId/tasks", (req, res) => {
  const userId = req.params.userId;

  validateUserExists(userId, res, () => {
    validateTask(req.body.name, res, () => {
      const task = { id: v4(), name: req.body.name };
      tasks.push(task);
      return res.status(201).send(task);
    });
  });
});

app.delete("/:userId/tasks/:taskId", (req, res) => {
  const userId = req.params.userId;
  const taskId = req.params.taskId;

  validateUserExists(userId, res, () => {
    validateTaskExists(taskId, res, () => {
      tasks = tasks.filter((value) => value.id !== taskId);
      return res.status(204).send("Task is deleted");
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
