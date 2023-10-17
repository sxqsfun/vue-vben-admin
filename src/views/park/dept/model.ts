/**
 * 部门-表单参数
 */
export interface DeptModelParams {
  id: string;
  code: string;
  name: string;
  employeeId: string;
  enableFlag: boolean;
  parentId: string;
}

export interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

export interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}
