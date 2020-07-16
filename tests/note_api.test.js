const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body.length).toBe(helper.initialBlogs.length)
    })

  test('blogs are identified by id field', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    expect(blogToView.id).toBeDefined()

  })

  describe('adding new blogs', () => {
    test('addition succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Blog Post',
        author: 'Frank',
        url: 'new-post-2020',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)


      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(n => n.title)
      expect(contents).toContain(
        'New Blog Post'
      )
    })

    test('default likes is zero', async () => {
      const newBlog = {
        title: 'Blog with zero likes',
        author: 'Hank',
        url: 'zero-likes-2020'
      }

      added_blog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)

      expect(added_blog.body.likes).toBe(0)
    })

    test('code 400 if no title or url', async () => {
      const newBlog = {
        author: 'Harry',
        likes: 0
      }

      added_blog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })
  test('delete existing blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(
      helper.initialBlogs.length - 1
    )

    const ids = blogsAtEnd.map(r => r.id)

    expect(ids).not.toContain(blogToDelete.id)
  })

  test('update existing blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes+1
    }

    updated_blog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)


    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)


    expect(updated_blog.body.likes).toBe(blogToUpdate.likes+1)
  })
})
afterAll(() => {
  mongoose.connection.close()
})