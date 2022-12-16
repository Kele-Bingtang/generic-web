import { Notification } from "element-ui";
import { MessageType } from "element-ui/types/message";

const custom = (
  title: string,
  message: string,
  type: MessageType,
  duration: number,
  dangerouslyUseHTMLString: boolean
) => {
  Notification({
    title,
    message,
    type: type,
    duration,
    dangerouslyUseHTMLString,
  });
};

const success = (message: string) => {
  Notification({
    title: "Successfully",
    message,
    type: "success",
    duration: 4000,
  });
};

const successInTime = (message: string, duration: number) => {
  Notification({
    title: "Successfully",
    message,
    type: "success",
    duration,
  });
};

const successHtml = (message: string) => {
  Notification({
    title: "Successfully",
    message,
    type: "success",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const successHtmlInTime = (message: string, duration: number) => {
  Notification({
    title: "Successfully",
    message,
    type: "success",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

const error = (message: string) => {
  Notification({
    title: "Error",
    message,
    type: "error",
    duration: 4000,
  });
};

const errorInTime = (message: string, duration: number) => {
  Notification({
    title: "Error",
    message,
    type: "error",
    duration,
  });
};

const errorHtml = (message: string) => {
  Notification({
    title: "Error",
    message,
    type: "error",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const errorHtmlInTime = (message: string, duration: number) => {
  Notification({
    title: "Error",
    message,
    type: "error",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

const info = (message: string) => {
  Notification({
    title: "Info",
    message,
    type: "info",
    duration: 4000,
  });
};

const infoInTime = (message: string, duration: number) => {
  Notification({
    title: "Info",
    message,
    type: "info",
    duration,
  });
};

const infoHtml = (message: string) => {
  Notification({
    title: "Info",
    message,
    type: "info",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const infoHtmlInTime = (message: string, duration: number) => {
  Notification({
    title: "Info",
    message,
    type: "info",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

const warning = (message: string) => {
  Notification({
    title: "warning",
    message,
    type: "warning",
    duration: 4000,
  });
};

const warningInTime = (message: string, duration: number) => {
  Notification({
    title: "warning",
    message,
    type: "warning",
    duration,
  });
};

const warningHtml = (message: string) => {
  Notification({
    title: "warning",
    message,
    type: "warning",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const warningHtmlInTime = (message: string, duration: number) => {
  Notification({
    title: "warning",
    message,
    type: "warning",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

export default {
  custom,
  success,
  successInTime,
  successHtml,
  successHtmlInTime,
  error,
  errorInTime,
  errorHtml,
  errorHtmlInTime,
  info,
  infoInTime,
  infoHtml,
  infoHtmlInTime,
  warning,
  warningInTime,
  warningHtml,
  warningHtmlInTime,
};
