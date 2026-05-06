const login = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title).first().waitFor()
}

const likeBlog = async (page, title, author) => {
  // Expand Details
  await page.getByText(`${title} ${author}`)
    .getByRole('button', { name: 'view' }).click()

  // Click Like
  await page.getByText(`${title} ${author}`).locator('..')
    .getByRole('button', { name: 'like' }).click()

  // Hide Details
  await page.getByText(`${title} ${author}`)
    .getByRole('button', { name: 'hide' }).click()

  await page.getByText(`${title} ${author}`)
    .getByRole('button', { name: 'view' }).waitFor()
}

export { login, createBlog, likeBlog }