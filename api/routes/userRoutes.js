let express = require('express')
let { registerUser, verifyUser, loginUser, fetchUsers, fetchUser, deleteUser, deleteUsers } = require('../controllers/usersControllers')
let isAuthenticated = require('../middleware/isAuthenticated')
let isAdmin = require('../middleware/isAdmin')

let userRouter = express.Router()


userRouter.post('/register', registerUser)
userRouter.post('/verify', verifyUser)
userRouter.post('/login', loginUser)

userRouter.get('/', isAuthenticated, isAdmin, fetchUsers)
userRouter.get('/:id', isAuthenticated, isAdmin, fetchUser)
userRouter.delete('/:id', isAuthenticated, isAdmin, deleteUser)
userRouter.delete('/', isAuthenticated, isAdmin, deleteUsers)

module.exports = userRouter
