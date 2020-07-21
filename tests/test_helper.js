const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "First",
        author: "TL",
        url: "first-one",
        likes: 0,
        id: "5ef9e4a4bd44ae27d89b8e23"
    },
    {
        title: "2nd",
        author: "TL",
        url: "second-one",
        likes: 2,
        id: "5efdafaa4bd44ae27d89b8e23"
    },
    {
        title: "Hello World",
        author: "Matt",
        url: "hello-world",
        likes: 1001,
        id: "5ef9fdafad4d44ae27d89b8e23"
    }
]

const initialUsers = [
    {
        username: "Test",
        name: "Testi Ukko",
        id: "5f10831f205615657681ee00"
    },
    {
        username: "T0hht",
        name: "Testi Ukko",
        id: "5f108a168aaef66c93c70b6f"
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