import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

describe('<Blog />', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: { id: 0 }
  }
  const blogUser = {
    id: 0
  }

  test('Renders default detail', () => {
    render(<Blog blog={blog} user={blogUser} />)

    const titleElements = screen.getAllByText('React patterns', { exact: false })
    expect(titleElements[0]).toBeVisible()
    expect(titleElements[1]).not.toBeVisible()

    const authorElements = screen.getAllByText('Michael Chan', { exact: false })
    expect(authorElements[0]).toBeVisible()
    expect(authorElements[1]).not.toBeVisible()

    expect(screen.getByText('https://reactpatterns.com/')).not.toBeVisible()
    expect(screen.getByText('7')).not.toBeVisible()
  })

  test('Renders details after clicking view', async () => {
    render(<Blog blog={blog} user={blogUser}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const titleElements = screen.getAllByText('React patterns', { exact: false })
    expect(titleElements[0]).not.toBeVisible()
    expect(titleElements[1]).toBeVisible()

    const authorElements = screen.getAllByText('Michael Chan', { exact: false })
    expect(authorElements[0]).not.toBeVisible()
    expect(authorElements[1]).toBeVisible()

    expect(screen.getByText('https://reactpatterns.com/')).toBeVisible()
    expect(screen.getByText('7')).toBeVisible()
  })

  test('Click like twice', async () => {
    const mockHandler = vi.fn()
    const mockLikeHandler = vi.spyOn(blogService, 'incrementLikes').mockImplementation(() => {})

    render(<Blog blog={blog} user={blogUser} updateBlog={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})