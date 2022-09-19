const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
  // res.send({ method: req.method, task: "getAllTasks" });
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  // res.send({method: req.method, task: "createTask", body: req.body})
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  // res.send({ method: req.method, task: "getTask", params: req.params });
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  //example!!
  //mongoose model has a .then so it can await SIMILAR to a promise but it is not a promise!!!
  // try {
  //   const { id: taskID } = req.params;
  //   const task = await Task.findOne({ _id: taskID });
  //   if (!task) {
  //     return res.status(404).json({ msg: `No task with id: ${taskID}` });
  //   }
  //   res.status(200).json({ task });
  // } catch (error) {
  //   res.status(500).json({ msg: error });
  // }

  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  // res.send({ method: req.method, task: "deleteTask", params: req.params });
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  // res.send({ method: req.method, task: "updateTask", body: req.body, params: req.params });
  const { id: taskID } = req.params;

  //third parameter uses the validators that we define in the model options
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
