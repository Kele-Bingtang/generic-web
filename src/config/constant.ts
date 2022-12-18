const serviceStatusOptions = [
  {
    value: "0",
    label: "开启",
  },
  {
    value: "1",
    label: "关闭",
  },
];

const serviceStatusType: { [propName: string]: string } = {
  启用: "success",
  关闭: "warning"
}

const operateTitle: { [propName: string]: string } = {
  read: "查看",
  edit: "编辑",
  add: "创建",
};

export default {
  serviceStatusOptions,
  serviceStatusType,
  operateTitle,
};
