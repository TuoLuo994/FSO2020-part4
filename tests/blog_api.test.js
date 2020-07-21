const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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
      const logInCreds = {
        "username": "Tupa",
        "password": "salis"
      }
  
      const token = await api
        .post('/api/login/')
        .send(logInCreds)

      const newBlog = {
        title: 'New Blog Post',
        author: 'Frank',
        url: 'new-post-2020',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token.body.token)
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
      const logInCreds = {
        "username": "Tepa",
        "password": "passu"
      }
  
      const token = await api
        .post('/api/login/')
        .send(logInCreds)

      const newBlog = {
        title: 'Blog with zero likes',
        author: 'Hank',
        url: 'zero-likes-2020'
      }

      added_blog = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token.body.token)
        .send(newBlog)
        .expect(200)

      expect(added_blog.body.likes).toBe(0)
    })

    test('code 400 if no title or url', async () => {
      const logInCreds = {
        "username": "Tupa",
        "password": "salis"
      }
  
      const token = await api
        .post('/api/login/')
        .send(logInCreds)

      const newBlog = {
        author: 'Harry',
        likes: 0
      }

      added_blog = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token.body.token)
        .send(newBlog)
        .expect(400)
    })


    test('code 401 if no token', async () => {
      const newBlog = {
        title: 'New Blog Post',
        author: 'Frank',
        url: 'new-post-2020',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)


      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })
  test('delete existing blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const logInCreds = {
      "username": "Tupa",
      "password": "salis"
    }

    const token = await api
      .post('/api/login/')
      .send(logInCreds)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + token.body.token)
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

  describe("don't add invalid users" , () => {
    beforeEach(async () => {
  
      await User.deleteMany({})
  
      const userObjects = helper.initialUsers
        .map(user => new User(user))
      const promiseArray = userObjects.map(user => user.save())
      await Promise.all(promiseArray)
    })
  
    test('username must be unique', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const user1 = {
        username: 'testuser',
        name: 'Frank',
        password: 'secure'
      }
      const user2 = {
        username: 'testuser',
        name: 'Hank',
        password: 'secure2'
      }
  
      await api
        .post('/api/users')
        .send(user1)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const result = await api
        .post('/api/users')
        .send(user2)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
        expect(result.body.error).toContain('`username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length+1)
    })
  
    test('username must exist', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = {
        name: 'Frank',
        password: 'secure'
      }
      await api
        .post('/api/users')
        .send(user)
        .expect(400)
  
  
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)  
      })

      test('password must exist', async () => {
        const usersAtStart = await helper.usersInDb()
        const user = {
          username: 'my_user',
          name: 'Frank'
        }
        await api
          .post('/api/users')
          .send(user)
          .expect(400)
    
    
          const usersAtEnd = await helper.usersInDb()
          expect(usersAtEnd).toHaveLength(usersAtStart.length)  
        })
        test('username must be more than two characters long', async () => {
          const usersAtStart = await helper.usersInDb()
          const user = {
            username: 'aa',
            name: 'Frank',
            password:'secure'
          }
          await api
            .post('/api/users')
            .send(user)
            .expect(400)
      
      
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)  
          })
          test('password must be more than two characters long', async () => {
            const usersAtStart = await helper.usersInDb()
            const user = {
              username: 'short password',
              name: 'Frank',
              password: 'aa'
            }
            await api
              .post('/api/users')
              .send(user)
              .expect(400)
        
        
              const usersAtEnd = await helper.usersInDb()
              expect(usersAtEnd).toHaveLength(usersAtStart.length)  
            })
  })
})
afterAll(() => {
  mongoose.connection.close()
})