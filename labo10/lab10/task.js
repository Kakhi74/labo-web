const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: String,
  userId: String,
});

taskSchema.methods.toDTO = function () {
  const obj = this.toObject();
  return {
    id: obj._id,
    name: obj.name,
  };
};

const Task = mongoose.model("Task", taskSchema);
exports.model = Task;
