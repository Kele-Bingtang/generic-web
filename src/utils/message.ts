import { Message } from "element-ui";
import { MessageType } from "element-ui/types/message";

const custom = (message: string, type: MessageType, duration: number, dangerouslyUseHTMLString: boolean) => {
  Message({
    message,
    type: type,
    duration,
    dangerouslyUseHTMLString,
  });
};

const success = (message: string) => {
  Message({
    message,
    type: "success",
    duration: 4000,
  });
};

const successInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "success",
    duration,
  });
};

const successHtml = (message: string) => {
  Message({
    message,
    type: "success",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const successHtmlInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "success",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

const error = (message: string) => {
  Message({
    message,
    type: "error",
    duration: 4000,
  });
};

const errorInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "error",
    duration,
  });
};

const errorHtml = (message: string) => {
  Message({
    message,
    type: "error",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const errorHtmlInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "error",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

const info = (message: string) => {
  Message({
    message,
    type: "info",
    duration: 4000,
  });
};

const infoInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "info",
    duration,
  });
};

const infoHtml = (message: string) => {
  Message({
    message,
    type: "info",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const infoHtmlInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "info",
    dangerouslyUseHTMLString: true,
    duration,
  });
};

const warning = (message: string) => {
  Message({
    message,
    type: "warning",
    duration: 4000,
  });
};

const warningInTime = (message: string, duration: number) => {
  Message({
    message,
    type: "warning",
    duration,
  });
};

const warningHtml = (message: string) => {
  Message({
    message,
    type: "warning",
    dangerouslyUseHTMLString: true,
    duration: 4000,
  });
};

const warningHtmlInTime = (message: string, duration: number) => {
  Message({
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
