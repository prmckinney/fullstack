import { Alert } from "@mui/material";
import { useNotification, useNotificationType } from "./Store";

const Notification = () => {
  const notification = useNotification();
  const notificationType = useNotificationType();
  if (!notification || !notificationType) {
    return null;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notificationType}
    >
      {notification}
    </Alert>
  );
};

export default Notification;
