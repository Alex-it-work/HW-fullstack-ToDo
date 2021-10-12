const { Router } = require('express');
const { taskController } = require('../controllers');

const taskRouter = Router();

taskRouter.get('/', taskController.getTasks);

taskRouter.get('/:taskId', taskController.getTaskById);

taskRouter.post('/', taskController.createTask);

taskRouter.patch('/:taskId', taskController.updateTask);

taskRouter.put('/:taskId', taskController.updateTask);

taskRouter.delete('/:taskId', taskController.deleteTask);

module.exports = taskRouter;
