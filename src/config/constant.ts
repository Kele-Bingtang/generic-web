const statusOptions = [
  {
    value: "Enable",
    label: "Enable",
  },
  {
    value: "Disable",
    label: "Disable",
  },
  {
    value: "Deleted",
    label: "Deleted",
  },
];

const operateTitle: { [propName: string]: string } = {
  look: "查看",
  edit: "编辑",
  add: "创建",
};

export default {
  statusOptions,
  operateTitle,
};
