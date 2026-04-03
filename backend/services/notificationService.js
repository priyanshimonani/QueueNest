import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  organizationId = null,
  type = "info",
  title,
  message
}) =>
  Notification.create({
    userId,
    organizationId,
    type,
    title,
    message
  });

export const createNotificationsForUsers = async ({
  userIds,
  organizationId = null,
  type = "info",
  title,
  message
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  return Notification.insertMany(
    userIds.map((userId) => ({
      userId,
      organizationId,
      type,
      title,
      message
    }))
  );
};
