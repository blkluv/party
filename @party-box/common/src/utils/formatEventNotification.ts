const formatEventNotification = (
  message: string,
  { location, startTime, name }: { location: string; startTime: string; name: string }
) => {
  return message.replace("{location}", location).replace("{startTime}", startTime).replace("{name}", name);
};

export default formatEventNotification;
