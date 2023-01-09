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

const mysqlColTypeOptions = [
  "bigint",
  "bigint unsigned",
  "binary",
  "bit",
  "Blob",
  "char",
  "Date",
  "DateTime",
  "decimal",
  "double",
  "double precision",
  "enum",
  "float",
  "int",
  "int unsigned",
  "integer",
  "integer unsigned",
  "long carbinary",
  "long varchar",
  "long lob",
  "longtext",
  "mediumblob",
  "mediumint",
  "mediumint unsigned",
  "mediumtext",
  "number",
  "peal",
  "set",
  "small int",
  "small int unsigned",
  "text",
  "time",
  "timestamp",
  "tinyblob",
  "tinyint",
  "tinyint unsigned",
  "tinytext",
  "varbinary",
  "varchar",
  "year",
];

const serviceStatusType: { [propName: string]: string } = {
  启用: "success",
  关闭: "warning",
};

const operateTitle: { [propName: string]: string } = {
  read: "查看",
  edit: "编辑",
  add: "创建",
};

export default {
  serviceStatusOptions,
  serviceStatusType,
  operateTitle,
  mysqlColTypeOptions,
};
