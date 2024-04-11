const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "UPDATE"],
  credentials: true,
};

const taskModel = require("./task.js").model;

const port = process.env.PORT || 8080;
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/lab10", {});
mongoose.Promise = global.Promise;

const realUserId = "un-id";

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).send({
      errorCode: "PARSE_ERROR",
      message: "Arguments could not be parsed, make sure request is valid.",
    });
  } else {
    res.status(500).send("Something broke server-side.", error);
  }
});

app.get("/", function (req, res) {
  res.send("Welcome to Lab10 API.");
});

app.post("/users", function (req, res) {
  return res.status(200).send(JSON.stringify({ id: realUserId }));
});

app.get("/:userId/tasks", async function (req, res) {
  const userId = req.params.userId;

  await ensureUserExist(userId, res, async function () {
    const mongoTasks = await taskModel.find({ userId: userId }).exec();

    const tasks = mongoTasks.map((task) => task.toDTO());
    return res.status(200).send(JSON.stringify({ tasks: tasks }));
  });
});

app.post("/:userId/tasks", async function (req, res) {
  const userId = req.params.userId;

  await ensureUserExist(userId, res, async function () {
    await ensureValidTask(req.body, res, async function () {
      const task = new taskModel({ userId: userId, name: req.body.name });
      await task.save();
      return res.status(200).send(JSON.stringify(task.toDTO()));
    });
  });
});

app.put("/:userId/tasks/:taskId", async function (req, res) {
  const taskId = req.params.taskId;
  const userId = req.params.userId;

  await ensureUserExist(userId, res, async function () {
    await ensureValidTask(req.body, res, async function () {
      const task = await taskModel.findOne({ _id: taskId });
      if (!task) {
        return res.status(404).send("No task found");
      }
      await taskModel
        .updateOne(
          {
            _id: taskId,
          },
          {
            name: req.body.name,
          }
        )
        .exec();

      const taskNew = await taskModel.findOne({ _id: taskId });
      return res.status(200).send(JSON.stringify(taskNew.toDTO()));
    });
  });
});

app.delete("/:userId/tasks/:taskId", async function (req, res) {
  const taskId = req.params.taskId;
  const userId = req.params.userId;

  await ensureUserExist(userId, res, async function () {
    const task = await taskModel.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).send("No task found");
    }
    const newTask = await taskModel.deleteOne({
      _id: taskId,
    });
    return res.status(200).send("Task deleted");
  });
});

async function ensureValidTask(task, res, callback) {
  if (task.name === undefined || task.name === "") {
    return res.status(400).send("Task definition is invalid.");
  }

  await callback();
}

async function ensureUserExist(userId, res, callback) {
  if (userId !== realUserId) {
    return res.status(400).send("User with id '" + userId + "' doesn't exist.");
  }

  await callback();
}

app.listen(port, function () {
  console.log(`Server listening at http://localhost:${port}`);
});
