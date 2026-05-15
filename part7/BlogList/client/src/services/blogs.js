import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log(blog);
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config);

  console.log(response.data);
  return response.data;
};

const deleteId = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  console.log("response ==> ", response);

  return response.data;
};

export default { setToken, getAll, createNew, update, deleteId };
