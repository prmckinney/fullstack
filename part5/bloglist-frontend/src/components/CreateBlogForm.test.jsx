import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm />', () => {
  test('Creating a new blog entry', async () => {
    const mockHandler = vi.fn()

    render(<CreateBlogForm createBlog={mockHandler} />)

    const inputTitle = screen.getByLabelText('title')
    const inputAuthor = screen.getByLabelText('author')
    const inputUrl = screen.getByLabelText('url')
    const createButton = screen.getByText('create')

    const user = userEvent.setup()
    await user.type(inputTitle, 'testing title')
    await user.type(inputAuthor, 'testing author')
    await user.type(inputUrl, 'testing url')
    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('testing title')
    expect(mockHandler.mock.calls[0][0].author).toBe('testing author')
    expect(mockHandler.mock.calls[0][0].url).toBe('testing url')
  })
})