const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')


router.get('/', todoController.getAllTodos )

router.post('/', todoController.createTodo )

router.patch('/:id', todoController.updateTodo)

router.put('/:id', todoController.editTodo); // Using PUT method for editing

router.delete('/:id', todoController.deleteTodo)

module.exports = router;
