import { defHttp } from '/@/utils/http/axios';
import { handleTree } from '/@/utils/tree/tree';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { DeptModelParams } from './model/deptModel';

/**
 * 部门管理API
 */
enum Api {
  Upload = '/file/admin/minio/upload',
  GetDeptTreeList = '/park/admin/dept/list',
  DeptAddOrUpdateUrl = '/park/admin/dept/',
  DeptAddOrUpdateTree = '/park/admin/dept/getDeptTree',
  DeptAddOrUpdateUserList = '/park/admin/dept/getDeptUserList',
  DeptAddOrUpdateUserListTable = '/park/admin/dept/getDeptUserListTable',
  AddDeptAddOrUpdate = '/park/admin/dept/add',
  UpdateDeptAddOrUpdate = '/park/admin/dept/update',
  DetailDeptAddOrUpdate = '/park/admin/dept/category/detail',
  GetPostList = '/park/admin/employee/getPostList',
  AddEmployeeAddOrUpdate = '/park/admin/dept/addEmployee',
  UpdateEmployeeAddOrUpdate = '/park/admin/dept/updateEmployee',
  GetEmployeeListPage = '/park/admin/dept/getEmployeeListPage',
  GetEmpSelectList = '/park/admin/employee/selectList',
  Template = '/park/admin/dept/template',
  ImportExcel = '/park/admin/dept/importExcel',
  ExportData = '/park/admin/dept/exportData',
  findEmpAll = 'park/admin/employee/findAll',
}

/**
 * @description: 获取部门信息树形列表
 */
export async function getDeptTreeList() {
  const data = await defHttp.get<any>({ url: Api.GetDeptTreeList });
  for (const d of data) {
    d.disabled = false;
    if (d.parentId != -1) {
      d.nameAndCode = d.name + ': ' + d.code;
    } else {
      d.nameAndCode = d.name;
    }
  }
  const hData = handleTree(data, 'id', 'parentId');
  return hData;
}

/**
 * @description: 获取部门树形结构
 */
export async function getDeptTree() {
  const data = await defHttp.get<any>({ url: Api.DeptAddOrUpdateTree });
  return [{ id: '-1', parentId: '-2', code: 'djbm', name: '顶级', children: data }];
}

/**
 * @description: 获取部门树形结构（无顶级）
 */
export async function getDeptTreeNotTop() {
  const data = await defHttp.get<any>({ url: Api.DeptAddOrUpdateTree });
  return data;
}

/**
 * @description: 获取部门负责人下拉列表(已启用的，User表中获取)
 */
export const getDeptUserList = () =>
  defHttp.get<any>({
    url: Api.DeptAddOrUpdateUserList,
  });

/**
 * @description: 获取部门负责人列表
 */
export const getDeptUserListTable = (params) =>
  defHttp.get<any>({
    url: Api.DeptAddOrUpdateUserListTable,
    params,
  });

/**
 * @description: 获取部门详情
 */
export const getDeptAddOrUpdateDetail = (id: string) =>
  defHttp.get<any>(
    { url: Api.DetailDeptAddOrUpdate, params: { deptCategoryId: id } },
    { isTransformResponse: false },
  );

/**
 * @description: 添加部门
 */
export const addDeptAddOrUpdate = (params: DeptModelParams) =>
  defHttp.post<any>(
    {
      url: Api.AddDeptAddOrUpdate,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 修改部门
 */
export const updateDeptAddOrUpdate = (params: DeptModelParams) =>
  defHttp.put<any>(
    {
      url: Api.UpdateDeptAddOrUpdate,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 删除部门
 */
export const delDept = (id: number) =>
  defHttp.delete<any>({ url: Api.DeptAddOrUpdateUrl + '/' + id }, { isTransformResponse: false });

/**
 * @description: 获取岗位下拉
 */
export function getPostList(params: any) {
  return defHttp.get({
    url: Api.GetPostList,
    params: params,
  });
}

export function UploadHeadPFile(params: any) {
  return defHttp.post<any>(
    {
      url: Api.Upload,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: 添加员工
 */
export const addEmployeeAddOrUpdate = (params) =>
  defHttp.post<any>(
    {
      url: Api.AddEmployeeAddOrUpdate,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 修改员工
 */
export const updateEmployeeAddOrUpdate = (params) =>
  defHttp.put<any>(
    {
      url: Api.UpdateEmployeeAddOrUpdate,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * 获取员工信息选择列表（分页，可搜索）
 */
export const getEmpSelectList = (params: EmployeeSearchParams) =>
  defHttp.get<any>({ url: Api.GetEmpSelectList, params }, { isTransformResponse: false });

/**
 * 获取员工信息下拉列表
 */
export const getEmpDropDown = async () => {
  const data = await defHttp.get<any>({
    url: Api.GetEmpSelectList,
    params: { page: 1, limit: 999999 },
  });
  for (const d of data) {
    d.nameAndCode = d.name + '-' + d.code;
  }
  return data;
};

/**
 * @description: 获取员工列表
 */
export const getEmployeeListPage = (params) =>
  defHttp.get<any>(
    {
      url: Api.GetEmployeeListPage,
      params: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );

/**
 * @description: 模板下载
 */
export const template = async () => {
  const res = await defHttp.get<any>(
    { url: Api.Template, responseType: 'blob' },
    { isReturnNativeResponse: true },
  );
  const blob = new Blob([res.data], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const exportLink = document.createElement('a');
  exportLink.setAttribute('download', '员工信息导入模板.xls');
  exportLink.href = url;
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
};

/**
 *  @description: 导入员工列表
 */
export function importExcel(file: any) {
  const data = new FormData();
  data.append('file', file);
  return defHttp.post<any>(
    {
      url: Api.ImportExcel,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      data,
    },
    { isTransformResponse: false },
  );
}

/**
 * @description: 导出员工管理
 */
export const exportData = async (params) => {
  const res = await defHttp.get<any>(
    { url: Api.ExportData, params, responseType: 'blob' },
    { isReturnNativeResponse: true },
  );
  const blob = new Blob([res.data], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const exportLink = document.createElement('a');
  exportLink.setAttribute('download', '员工信息.xls');
  exportLink.href = url;
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
};
/**
 * @description: 查询员工
 */
export function findEmpAll(params: any) {
  return defHttp.get<any>(
    { url: Api.findEmpAll, params },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );
}
