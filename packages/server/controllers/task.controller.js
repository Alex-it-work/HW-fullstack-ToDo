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
  const {
    params: { taskId },
    body,
  } = req;
  try {
    const [updatedTaskCount, [updatedTask]] = await Task.update(body, {
      where: { id: taskId },
      returning: true,
    });

    if (updatedTaskCount > 0) {
      const preparedTask = _.omit(updatedTask.get(), [
        'createdAt',
        'updatedAt',
        'passwordHash',
      ]);
      return res.status(200).send({ data: preparedTask });
    }
    next(createError(404, 'Task Not Found'));
  } catch (e) {
    next(e);
  }
};

module.exports.updateOrCreateTask = async (req, res) => {
  const {
    params: { userId: taskId },
    body,
  } = req;
  try {
    const [updatedTaskCount] = await Task.update(body, {
      where: { id: taskId },
    });

    if (updatedTaskCount > 0) {
      return res.status(204).send();
    }

    req.body.id = taskId;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.deleteTask = async (req, res) => {
  const {
    params: { userId: taskId },
  } = req;
  try {
    const deletedCount = await Task.destroy({ where: { id: taskId } });
    if (deletedCount) {
      return res.status(204).send();
    }
    next(createError(404, 'Task Not Found'));
  } catch (e) {
    next(e);
  }
};
