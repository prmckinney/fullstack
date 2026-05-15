import { useBlogs } from "./Store";

const BlogList = () => {
  const blogs = useBlogs();

  return (
    <div>
      {/* {userLogin} */}
      <h2>Blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => {
          const url = `blogs/${blog.id}`;
          return (
            <li key={blog.id}>
              <a href={url}>
                {blog.title} by {blog.author}
              </a>
            </li>
          );
        })}
    </div>
  );
};

export default BlogList;
