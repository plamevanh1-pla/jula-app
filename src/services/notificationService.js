export const registerForPushNotifications = async () => {
  console.log("Service push initialisé pour l'application Jula Android.");
  return null;
};

export const sendLocalNotification = (title, body) => {
  console.log(`[Notification Jula] ${title} : ${body}`);
};