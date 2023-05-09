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

const colTypeAndComponent = {
  String: ["el-input", "text"],
  Integer: ["el-input", "number"],
  Float: ["el-input", "number"],
  Double: ["el-input", "number"],
  Date: ["el-date-picker", "date"],
  DateTime: ["el-date-picker", "datetime"],
  TimeStamp: ["el-date-picker", "datetime"],
  Blob: ["el-input", "textarea"],
  Text: ["el-input", "textarea"],
};

const colTypeAndComponentSearch = {
  String: ["el-input", "text"],
  Integer: ["el-input", "number"],
  Float: ["el-input", "number"],
  Double: ["el-input", "number"],
  Date: ["el-date-picker", "daterange"],
  DateTime: ["el-date-picker", "datetimerange"],
  TimeStamp: ["el-date-picker", "datetimerange"],
  Blob: ["el-input", "text"],
  Text: ["el-input", "text"],
};

const serviceStatusType: { [propName: string]: string } = {
  0: "warning",
  1: "success",
};

const operateTitle: { [propName: string]: string } = {
  read: "查看",
  edit: "编辑",
  add: "创建",
  copy: "复制",
};

export default {
  serviceStatusOptions,
  serviceStatusType,
  operateTitle,
  mysqlColTypeOptions,
  colTypeAndComponent,
  colTypeAndComponentSearch,
};
