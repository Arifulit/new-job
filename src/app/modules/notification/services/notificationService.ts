import { Notification, INotification } from "../models/Notification";
import { sendEmail } from "../../../utils/mailer";

export const createNotification = async (data: INotification, sendMail = false, email?: string) => {
  const notification = await Notification.create(data);

  if (sendMail && email) {
    await sendEmail({
      to: email,
      subject: "New Notification",
      text: data.message
    });
  }

  return notification;
};

export const getUserNotifications = async (userId: string) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markNotificationRead = async (id: string) => {
  return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};
