const _ = require('lodash')

const favoriteBlog = (blogs) => {
  const result = _(blogs).maxBy('likes')
  //console.log(result)
  return result
}

const mostBlogs = (blogs) => {
  const maxBlog = _(blogs).countBy('author').entries().maxBy(_.last)
  //console.log(maxBlog)
  const result = { author: _.first(maxBlog), blogs: _.last(maxBlog) }
  return result
}

const mostLikes = (blogs) => {
  const sumLikes = _(blogs).groupBy('author').map((v, k) => ({ author: k, likes: _(v).sumBy('likes') })).value()
  const maxBlog = _(sumLikes).maxBy('likes')

  return maxBlog
}

module.exports = { favoriteBlog, mostBlogs, mostLikes }