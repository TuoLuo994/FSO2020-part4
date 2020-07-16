var _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    var totalLikes = 0
    blogs.forEach(blog => {
        totalLikes += blog.likes
    })
    return totalLikes
}

const favoriteBlog = (blogs) => {
    var maxFavorites = 0
    var result = null
    blogs.forEach(blog => {
        if(blog.likes >= maxFavorites){
            maxFavorites = blog.likes
            result = blog
        }
    })
    return result
}

const mostBlogs = (blogs) => {
    if(blogs.length == 0){
        return null
    }
    var output =
        _(blogs)
        .groupBy('author',)
        .map((objs, key) => ({
            'author':key,
            'blogs': objs.length
        }))
        .maxBy('blogs')
    return output
}

const mostLikes = (blogs) => {
    if(blogs.length == 0){
        return null
    }
    var output =
        _(blogs)
        .groupBy('author',)
        .map((objs, key) => ({
            'author':key,
            'likes': _.sumBy(objs, 'likes')
        }))
        .maxBy('likes')
    return output
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }