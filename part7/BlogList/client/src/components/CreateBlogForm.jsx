import { useField } from "../hooks/field";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useBlogControl } from "./Store";

const CreateBlogForm = ({ createBlog }) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");
  const navigate = useNavigate();
  const { addBlog } = useBlogControl();

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    await addBlog({ title: title.value, author: author.value, url: url.value });
    navigate("/");
  };

  return (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <TextField label="title" {...title} style={{ marginBottom: 10 }} />
        </div>
        <div>
          <TextField label="author" {...author} style={{ marginBottom: 10 }} />
        </div>
        <div>
          <TextField label="url" {...url} style={{ marginBottom: 10 }} />
        </div>
        <Button type="submit" variant="contained">
          create
        </Button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
