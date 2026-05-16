import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useUsers } from "./Store";

const UserList = () => {
  const users = useUsers();

  return (
    <div>
      <h1>Users</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>User Name</b>
            </TableCell>
            <TableCell>
              <b>Blogs Created</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users
            .sort((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => {
              const url = `users/${user.id}`;
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <a href={url}>{user.name}</a>{" "}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
