const { Task } = require('./../models');
const _ = require('lodash');

module.exports.getTasks = async (req, res, next) => {
  try {
    const foundTasks = await Task.findAll({
      raw: true,
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt'],
      },
      limit: 5,
    });

    res.status(200).send(foundTasks);
  } catch (e) {
    next(e);
  }
};

module.exports.getTaskById = async (req, res) => {
  const {
    params: { taskId },
  } = req;

  try {
    const [foundTask] = await Task.findAll({
      raw: true,
      where: { id: taskId },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt'],
      },
    });
    if (foundTask) {
      res.status(200).send(foundTask);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (e) {
    next(e);
  }
};

module.exports.createTask = async (req, res, next) => {
  const { body } = req;

  try {
    const createdTask = await Task.create(body);

    const preparedTask = _.omit(createdTask.get(), [
      'id',
      'createdAt',
      'updatedAt',
    ]);

    res.status(200).send(preparedTask);
  } catch (e) {
    next(e);
  }
};

module.exports.updateTask = async (req, res) => {
  console.log(`updateTask`);
};
module.exports.deleteTask = async (req, res) => {
  console.log(`deleteTask`);
};
