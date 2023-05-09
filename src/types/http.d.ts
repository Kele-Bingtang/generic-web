declare namespace http {
  interface Condition {
    column: string;
    value: string;
    type?: string;
  }

  interface Page {
    pageNo: number;
    pageSize: number;
  }

  interface Response<T> {
    code: number;
    status: string; // success、fail、error ......
    message: string;
    data: T;
  }
}
