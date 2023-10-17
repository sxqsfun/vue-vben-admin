import { defHttp } from '/@/utils/http/axios';
import { handleTree } from '/@/utils/tree/tree';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { MenuSearchParams, MenuModel, MenuParams } from './model';

/**
 * 系统菜单API
 */
enum Api {
  GetMenuList = '/user/admin/menu/list',
  GetPageUrlList = '/user/admin/menu/pageUrlList',
  MenuUrl = '/user/admin/menu',
  AddMenu = '/user/admin/menu/add',
  UpdateMenu = '/user/admin/menu/update',
}

/**
 * @description: 获取菜单树形列表
 */
export async function getMenuTreeList(params?: MenuSearchParams) {
  const data = await defHttp.get<MenuModel>({ url: Api.GetMenuList, params });
  var hData = handleTree(data);
  if (params?.top) {
    return [{ id: '-1', parentId: '-2', name: '顶级', children: hData }];
  } else {
    return hData;
  }
}

/**
 * @description: 获取页面路由地址列表
 */
export const getPageUrlList = () => defHttp.get<any>({ url: Api.GetPageUrlList });

/**
 * @description: 添加菜单
 */
export const addMenu = (params: MenuParams) =>
  defHttp.post<any>(
    {
      url: Api.AddMenu,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 修改菜单
 */
export const updateMenu = (params: MenuParams) =>
  defHttp.put<any>(
    {
      url: Api.UpdateMenu,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 删除菜单
 */
export const delMenu = (id: string) =>
  defHttp.delete<any>({ url: Api.MenuUrl + '/' + id }, { isTransformResponse: false });
