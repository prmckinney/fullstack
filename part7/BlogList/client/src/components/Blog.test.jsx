import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import blogService from "../services/blogs";

describe("<Blog />", () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: { id: 0 },
  };
  const blogOwner = {
    id: 0,
  };
  const blogAltUser = {
    id: 1,
  };

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
  });

  test("Renders default details for unauthorized user", () => {
    render(<Blog blog={blog} user={null} />);

    expect(screen.getByText("React patterns", { exact: false })).toBeVisible();
    expect(screen.getByText("Michael Chan", { exact: false })).toBeVisible();
    expect(screen.getByText("https://reactpatterns.com/")).toBeVisible();
    expect(screen.getByText("7 likes")).toBeVisible();
    expect(screen.queryByRole("button", { name: "like" })).toBeNull();
    expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
  });

  test("Renders default details for authorized user", () => {
    render(<Blog blog={blog} user={blogAltUser} />);

    expect(screen.getByText("React patterns", { exact: false })).toBeVisible();
    expect(screen.getByText("Michael Chan", { exact: false })).toBeVisible();
    expect(screen.getByText("https://reactpatterns.com/")).toBeVisible();
    expect(screen.getByText("7 likes")).toBeVisible();
    expect(screen.queryByRole("button", { name: "like" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
  });

  test("Renders default details for owner", () => {
    render(<Blog blog={blog} user={blogOwner} />);

    expect(screen.getByText("React patterns", { exact: false })).toBeVisible();
    expect(screen.getByText("Michael Chan", { exact: false })).toBeVisible();
    expect(screen.getByText("https://reactpatterns.com/")).toBeVisible();
    expect(screen.getByText("7 likes")).toBeVisible();
    expect(screen.queryByRole("button", { name: "like" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "remove" })).toBeVisible();
  });

  test("Click like twice", async () => {
    const mockHandler = vi.fn();
    const mockLikeHandler = vi
      .spyOn(blogService, "incrementLikes")
      .mockReturnValue({ likes: 2 });

    render(<Blog blog={blog} user={blogAltUser} updateBlog={mockHandler} />);

    const user = userEvent.setup();
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  });
});
