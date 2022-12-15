export interface Condition {
  column: string;
  value: string;
  type?: string;
}

export interface Page {
  pageNo: number;
  pageSize: number;
}

export interface Response<T> {
  code: number;
  status: string; // success、fail、error ......
  message: string;
  data: T;
}
