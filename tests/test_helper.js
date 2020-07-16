const Blog = require('../models/blog')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }


module.exports = {
    initialBlogs, blogsInDb
}