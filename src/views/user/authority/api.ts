import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

/**
 * 权限同步API
 */
enum Api {
  AuthoritySelectList = '/user/admin/authority/nacosServiceNameList',
  Sync = '/user/admin/authority/sync',
  AuthorityList = '/user/admin/authority/list',
}

//同步权限下拉列表接口
export function getAuthoritySelectList() {
  return defHttp.get({
    url: Api.AuthoritySelectList,
  });
}

//同步接口
export function sync() {
  return defHttp.post(
    {
      url: Api.Sync,
      timeout: 20000,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    { isTransformResponse: false },
  );
}

export function getAuthorityList(params: any) {
  return defHttp.get(
    {
      url: Api.AuthorityList,
      params: params,
    },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );
}
