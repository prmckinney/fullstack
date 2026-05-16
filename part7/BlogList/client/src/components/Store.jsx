import { create } from "zustand";
import loginService from "../services/login";
import blogService from "../services/blogs";
import userService from "../services/users";

import { getUser, saveUser, removeUser } from "../services/persistentUser";

const setNotification = ({ notification, type }) => {
  useNotificationStore.setState({ notification: notification, type: type });
  setTimeout(() => {
    useNotificationStore.setState({ notification: null, type: null });
  }, 5000);
};

const useLoginStore = create((set) => ({
  user: null,
  username: "",
  password: "",
  token: "",
  actions: {
    setUsername: (username) => set(() => ({ username })),
    setPassword: (password) => set(() => ({ password })),
    initializeLogin: async () => {
      const loggedUserJSON = getUser();
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        console.log("user ==> ", user);
        set(() => ({ user: user, username: "", password: "" }));
        blogService.setToken(user.token);
      }
    },
    login: async () => {
      try {
        console.log("LOGIN");
        const username = useLoginStore.getState().username;
        const password = useLoginStore.getState().password;

        const user = await loginService.login({ username, password });

        saveUser(user);
        blogService.setToken(user.token);
        console.log("user ==> ", user);
        console.log("logged in with", username, password);
        setNotification({
          notification: `Logged in as ${username}`,
          type: "info",
        });

        set(() => ({ user: user, username: "", password: "" }));
      } catch {
        setNotification({ notification: "wrong credentials", type: "error" });
      }
    },
    logout: () => {
      removeUser();
      blogService.setToken("");

      set(() => ({ user: null, username: "", password: "" }));

      console.log("logged out");

      setNotification({
        notification: "logged out",
        type: "info",
      });
    },
  },
}));

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initializeBlog: async () => {
      const blogs = await blogService.getAll();
      console.log("blogs ==> ", blogs);
      set(() => ({ blogs }));
    },
    addBlog: async (content) => {
      const newBlog = await blogService.createNew(content);
      setNotification({
        notification: `Added ${content.title}`,
        type: "info",
      });
      set((state) => ({ blogs: [...state.blogs, newBlog] }));
    },
    removeBlog: async (id) => {
      const tempBlog = useBlogStore
        .getState()
        .blogs.find((blog) => blog.id === id);
      await blogService.deleteId(id);
      setNotification({
        notification: `Removed ${tempBlog.title}`,
        type: "warning",
      });

      set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) }));
    },
    addLike: async (id) => {
      const tempBlog = useBlogStore
        .getState()
        .blogs.find((blog) => blog.id === id);
      const updatedBlog = { ...tempBlog, likes: tempBlog.likes + 1 };
      await blogService.update(updatedBlog);
      setNotification({
        notification: `Liked ${tempBlog.title}`,
        type: "info",
      });

      set((state) => ({
        blogs: state.blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
      }));
    },
  },
}));

const useUserStore = create((set) => ({
  users: [],
  actions: {
    initializeUsers: async () => {
      const users = await userService.getAll();
      console.log("users ==> ", users);
      set(() => ({ users }));
    },
  },
}));

const useNotificationStore = create((set) => ({
  notification: null,
  type: null,
  actions: {
    setNotification: ({ notification: notification, type: type }) =>
      set(() => ({ notification: notification, type: type })),
  },
}));

// Login Hooks
export const useLogin = () => useLoginStore((state) => state.user);
export const useUsername = () => useLoginStore((state) => state.username);
export const usePassword = () => useLoginStore((state) => state.userpassword);
export const useLoginControl = () => useLoginStore((state) => state.actions);

// Blog Hooks
export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogControl = () => useBlogStore((state) => state.actions);

// User Hooks
export const useUsers = () => useUserStore((state) => state.users);
export const useUserControl = () => useUserStore((state) => state.actions);

// Notification Hooks
export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationType = () =>
  useNotificationStore((state) => state.type);
export const useNotificationControl = () =>
  useNotificationStore((state) => state.actions);

export default useBlogStore;
