const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    await request.post('/api/testing/reset')
    // create a users for the backend here
    await request.post('/api/users', {
      data: {
        name: 'Test Account',
        username: 'test',
        password: 'password'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Test Account2',
        username: 'test2',
        password: 'password2'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'test', 'password')
      await expect(page.getByText('Blogs')).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'test', 'notmypassword')
      await expect(page.getByText('wrong credentials')).toBeVisible()

    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'test', 'password')
      await createBlog(page, 'test blog', 'test author', 'test url')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('test blog test author').filter({ visible: true })).toBeVisible()
    })

    test('like a blog', async ({ page }) => {
      // Expand Details
      await page.getByText('test blog test author')
        .getByRole('button', { name: 'view' }).click()

      // Click Like
      await page.getByText('test blog test author').locator('..')
        .getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1')).toBeVisible()
    })

    test('delete a blog', async ({ page }) => {
      // Setup dialog event listener
      page.on('dialog', async dialog => {
        if (dialog.type() === 'confirm') {
          await dialog.accept();
        }
      })

      // Expand Details
      await page.getByText('test blog test author')
        .getByRole('button', { name: 'view' }).click()

      // Click Delete
      await page.getByText('test blog test author').locator('..')
        .getByRole('button', { name: 'delete' }).click()

      await expect(page.getByText('test blog test author').filter({ visible: true })).not.toBeVisible()
    })

    test('can\'t delete other\'s blog', async ({ page }) => {
      // Logout
      await page.getByRole('button', { name: 'Logout' }).click()
      // Login as 2nd user
      await login(page, 'test2', 'password2')

      // Expand Details
      await page.getByText('test blog test author')
        .getByRole('button', { name: 'view' }).click()

      // Ensure no delete button
      await expect(page.getByRole('button', { name: 'delete' })).toBeHidden()
    })

    test('blogs sorted by number of likes', async ({ page }) => {
      // Create two additional blogs
      await createBlog(page, 'test2 blog', 'test2 author', 'test2 url')
      await createBlog(page, 'test3 blog', 'test3 author', 'test3 url')

      await likeBlog(page, 'test2 blog', 'test2 author')
      await likeBlog(page, 'test2 blog', 'test2 author')
      await likeBlog(page, 'test2 blog', 'test2 author')
      await likeBlog(page, 'test3 blog', 'test3 author')
      await likeBlog(page, 'test3 blog', 'test3 author')

      // Order should be test2, test3, test
      const blogs = await page.getByText(/test\d? blog/).filter({ hasNotText: 'New blog', visible: true }).all()

      await expect(blogs[0]).toContainText('test2 blog')
      await expect(blogs[1]).toContainText('test3 blog')
      await expect(blogs[2]).toContainText('test blog')
    })
  })
})