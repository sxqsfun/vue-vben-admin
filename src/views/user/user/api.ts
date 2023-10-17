import { defHttp } from '/@/utils/http/axios';
import { UserQueryParams, GetUserListModel, UserAddParams, BindEmpParams, EmployeeSearchParams } from './model';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import MD5 from 'crypto-js/md5';

/**
 * 系统用户API
 */
enum Api {
  TestRetry = '/Retry',
  GetRoleList = '/user/admin/user/roleList',
  GetUserList = '/user/admin/user/list',
  ResetPassword = '/user/admin/user/resetPassword',
  UpdateUser = '/user/admin/user/updateUser',
  AddUser = '/user/admin/user/add',
  Upload = '/file/admin/minio/upload',
  TplDownload = '/file/admin/file/get/tpl',
  VerifyPwd = '/user/admin/user/verifyPwd',
  UpdatePwd = '/user/admin/user/updatePwd',
  BindEmp = '/user/admin/user/bindEmp',
  GetEmpSelectList = '/zone/admin/employee/selectList',
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

/**
 * @description: getUserList
 */
export function getUserList(params: UserQueryParams) {
  return defHttp.get<GetUserListModel>(
    { url: Api.GetUserList, params },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );
}

/**
 * @description: resetPassword
 */
export function ResetPassword(params: { id: number }) {
  return defHttp.put<any>(
    {
      url: Api.ResetPassword,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: addUser
 */
export function AddUser(params: UserAddParams) {
  return defHttp.post<any>(
    {
      url: Api.AddUser,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: updateUser
 */
export function UpdateUser(params: UserAddParams) {
  return defHttp.put<any>(
    {
      url: Api.UpdateUser,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: upload
 */
export function Upload(params: any) {
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
 * @description: VerifyPwd
 */
export function VerifyPwd(params: { id: string | number; pwd: string }) {
  return defHttp.put<any>(
    {
      url: Api.VerifyPwd,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: { id: params.id, pwd: MD5(params.pwd).toString() },
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: VerifyPwd
 */
export function UpdatePwd(params: { id: string; pwd: string }) {
  return defHttp.put<any>(
    {
      url: Api.UpdatePwd,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: { id: params.id, pwd: MD5(params.pwd).toString() },
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: getRoleList
 */
export function GetRoleList() {
  return defHttp.get<any>(
    { url: Api.GetRoleList },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: 绑定员工信息
 */
export const bindEmp = (params: BindEmpParams) =>
  defHttp.post<any>(
    { url: Api.BindEmp, headers: { 'Content-Type': ContentTypeEnum.JSON }, data: params },
    { isTransformResponse: false },
  );

/**
 * 获取员工信息选择列表（分页，可搜索）
 */
export const getEmpSelectList = (params: EmployeeSearchParams) =>
  defHttp.get<any>({ url: Api.GetEmpSelectList, params }, { isTransformResponse: false });

/**
 * 模板文件下载
 */
export const tplDownload = async (fileName: string) => {
  const res = await defHttp.get<any>(
    { url: Api.TplDownload + '/' + fileName, responseType: 'blob' },
    { isReturnNativeResponse: true },
  );
  if (res && res.data) {
    const fileURL = window.URL.createObjectURL(res.data);
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', fileName);
    document.body.appendChild(fileLink);
    fileLink.click();
  }
};
