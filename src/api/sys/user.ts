import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';
import { ErrorMessageMode } from '/#/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import MD5 from 'crypto-js/md5';

enum Api {
  Login = '/oauth2/admin/user/login',
  Logout = '/oauth2/admin/user/logout',
  GetUserInfo = '/user/admin/login/userInfo',
  GetPermCode = '/user/admin/login/getPermList',
  VerifyPwd = '/user/admin/user/verifyPwd',
  UpdatePwd = '/user/admin/user/updateSelfPwd',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: {
        grant_type: 'password',
        scope: 'web',
        client_id: 'webApp',
        client_secret: 'webApp',
        username: params.username,
        password: MD5(params.password).toString(),
      },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
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
export function UpdatePwd(params: { id: string | number; pwd: any }) {
  return defHttp.put<any>(
    {
      url: Api.UpdatePwd,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: { id: params.id, pwd: MD5(params.pwd).toString() },
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
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
