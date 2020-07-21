const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        likes: 0,
        title: "Hello World",
        author: "Angus Young",
        url: "www.google.com",
        id: "5f16fabd11a3296d51e749b0",
        user: "5f16f9d623739b6ba591ada0"
    },
    {
        likes: 0,
        title: "What is cheese?",
        author: "John Wick",
        url: "www.cheese.io",
        id: "5f16fafa11a3296d51e749b1",
        user: "5f16f9da23739b6ba591ada1"
    }
]

const initialUsers = [
    {
        "_id": "5f16f9d623739b6ba591ada0",
        "blogs": [],
        "username": "Tupa",
        "name": "Tuomas",
        "passwordHash": "$2b$10$d3UmE5oGAVNUcrmO51r4/eguwiSmiS5ji./sqsDp/nE.23gizTfUm",
    },
    {
        "_id": "5f16f9da23739b6ba591ada1",
        "blogs": [],
        "username":"Tepa",
        "name": "Teemu",
        "passwordHash": "$2b$10$Q2GKdp/FZRJy/2mrqtLbtuqgmfEmZ1iyCD59Uhsei/twSoxjnMU7K"
  }
]
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }

module.exports = {
    initialBlogs, blogsInDb, initialUsers, usersInDb
}