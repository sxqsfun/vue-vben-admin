import { defHttp } from '/@/utils/http/axios';
import { RoleListResultModel, RoleParams } from './model';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { handleTree } from '/@/utils/tree/tree';

/**
 * 系统角色API
 */
enum Api {
  GetRoleList = '/user/admin/role/list',
  DelRole = '/user/admin/role',
  UpdateRole = '/user/admin/role/update',
  AddRole = '/user/admin/role/add',
  AuthTree = '/user/admin/role/authTree',
  SaveAuth = '/user/admin/role/addRoleMenu',
  getDeptList = '/park/admin/dept/list',
}

/**
 * @description: getRoleList
 */
export function getRoleList(params?: { keyword: string }) {
  return defHttp.get<RoleListResultModel>(
    { url: Api.GetRoleList, params },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );
}

/**
 * @description: delRole
 */
export function delRole(params: { id: number }) {
  return defHttp.delete<any>(
    {
      url: Api.DelRole + '/' + params.id,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: addRole
 */
export function addRole(params: RoleParams) {
  return defHttp.post<any>(
    {
      url: Api.AddRole,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: updateRole
 */
export function updateRole(params: RoleParams) {
  return defHttp.put<any>(
    {
      url: Api.UpdateRole,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}
/**
 * @description: authTree
 */
export function authTree(params: { roleId: number }) {
  return defHttp.get<any>(
    {
      url: Api.AuthTree,
      params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}
/**
 * @description: saveAuth
 */
export function saveAuth(params: any, id: string, rootMenuId: string) {
  return defHttp.post<any>(
    {
      url: Api.SaveAuth,
      timeout: 20000,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: params,
      params: { roleId: id, rootMenuId: rootMenuId },
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * 获取部门树列表
 */
export async function getDeptTreeList() {
  const data = await defHttp.get<any>({ url: Api.getDeptList });
  const hData = handleTree(data, 'id', 'parentId');
  for (const d of data) {
    d.disabled = false;
  }
  return hData;
}
