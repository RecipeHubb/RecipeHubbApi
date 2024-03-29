export {}
const route = require('express').Router();
const controller = require('./UserController')




route.post('/', controller.create)
route.get('/', controller.read)
route.get('/data', controller.data)
route.get('/:id', controller.getUserById)
route.put('/:email', controller.update)
route.delete('/:email', controller.delete)

module.exports = route