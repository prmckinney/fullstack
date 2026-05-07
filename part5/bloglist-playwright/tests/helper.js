const login = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title).first().waitFor()
}

const likeBlog = async (page, title, author) => {
  // Expand Details
  await page.getByRole('link', { name: `${title} ${author}` }).click()

  // Click Like
  await page.getByRole('button', { name: 'like' }).click()

  // Return to blog page
  await page.getByRole('link', { name: 'blogs' }).click()

  // Wait for return to main page
  await page.getByText('logged in').waitFor()
}

export { login, createBlog, likeBlog }