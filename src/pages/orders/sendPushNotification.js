const URL =
  "https://rgz6pxjse1.execute-api.us-east-1.amazonaws.com/dev/sendpushnotification";

export async function sendPushNotification(pushNotifications) {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ notifications: pushNotifications })
    });

    return res;
  } catch (e) {
    return e;
  }
}
