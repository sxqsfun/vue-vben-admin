import type { RouteMeta } from 'vue-router';

/**
 * 菜单管理-查询参数
 */
export interface MenuSearchParams {
  name?: string;
  top?: boolean; //是否添加顶级
}

/**
 * 菜单管理-表单参数
 */
export interface MenuParams {
  id: number;
  name: string;
  type: number
  parentId: number;
  sortNumber: number;
}

/**
 * 菜单信息
 */
export interface MenuModel {
  id: string;
  createTime: string;
  creator: number;
  creatorName: string;
  updateTime: string;
  modifier: string;
  modifierName: string;
  remark: string;
  parentId: number;
  parentName: string;
  name: string;
  type: number;
  url: string;
  component: string;
  icon: string;
  sortNumber: number;
  authority: string;
  grade: number;
  children: [];
}

/**
* 菜单路由信息
*/
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: 菜单路由信息列表
 */
export type getMenuListRouteResult = RouteItem[];
