 
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  
    response.json(users.map(users => users.toJSON()))
  })
  
usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!('username' in body) || !('password' in body)){
    return response.status(400).json({ error: 'username and password must exist' })
  }
  if (body.password.length < 3 || body.username.length < 3) {
      return response.status(400).json({ error: 'username and password must be more than 3 characters' })
    }
  if (body.password === undefined || body.username === undefined) {
      return response.status(400).json({ error: 'no username or password given' })
  }
      
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = await new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  try{
    const savedUser = await user.save()
    response.json(savedUser)
  } catch(error) {
    next(error)
  }

  
})

module.exports = usersRouter