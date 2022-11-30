const path = require('path')
const express = require('express')

const employeeController = require('../../controllers/employeesController')
const verifyJwt = require('../../middleware/verifyJWT')

const router = express.Router()


router.route('/')
    .get(verifyJwt, employeeController.getAllEmployees)
    .post(employeeController.createNewEmployee)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee)

router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router