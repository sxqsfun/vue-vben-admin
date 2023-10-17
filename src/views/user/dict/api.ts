import { defHttp } from '/@/utils/http/axios';

import { ContentTypeEnum } from '/@/enums/httpEnum';
import { dictTypeResultModel, dictTypeParams, dictDataParams, dictDataResultModel } from './model';

/**
 * 系统字典API
 */
enum Api {
  DictTypePage = '/user/admin/dict/page',
  AddDictType = '/user/admin/dict/add',
  DeleteDictType = '/user/admin/dict/delete',
  EditDictType = '/user/admin/dict/edit',
  DictValuePage = '/user/admin/dict/dictData/page',
  DeleteDictValue = '/user/admin/dict/dictData/delete',
  AddDictValue = '/user/admin/dict/dictData/add',
  UpdateDictValue = '/user/admin/dict/dictData/edit',
  DictTree = '/user/admin/dict/tree',
  DictListByCode = '/user/admin/dict/dictData/listByTypeCode',
  DictMapByCodes = '/user/admin/dict/dictData/mapByTypeCodes',
}

/**
 * @description: getDictTypeList
 */
export function getDictTypeList(params: dictTypeParams) {
  return defHttp.get<dictTypeResultModel>(
    {
      url: Api.DictTypePage,
      params,
    },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );
}

/**
 * @description:  DeleteDictType
 */
export function DeleteDictType(params: dictTypeParams) {
  return defHttp.post<any>(
    {
      url: Api.DeleteDictType,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: [{ id: params.id }],
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description:  updateDictType
 */
export function UpdateDictType(params: dictTypeParams) {
  return defHttp.post<any>(
    {
      url: Api.EditDictType,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description:  addDictType
 */
export function AddDictType(params: dictTypeParams) {
  return defHttp.post<any>(
    {
      url: Api.AddDictType,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: getDictValuePage
 */
export function getDictValuePage(params: { value?: string; code?: string; typeId: string }) {
  return defHttp.get<dictDataResultModel>(
    {
      url: Api.DictValuePage,
      params,
    },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );
}

/**
 * @description:  DeleteDictValue
 */
export function DeleteDictValue(params: { id?: string }) {
  return defHttp.post<any>(
    {
      url: Api.DeleteDictValue,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: [{ id: params.id }],
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description:  UpdateDictValue
 */
export function UpdateDictValue(params: dictDataParams) {
  return defHttp.post<any>(
    {
      url: Api.UpdateDictValue,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description:  AddDictValue
 */
export function AddDictValue(params: dictDataParams) {
  return defHttp.post<any>(
    {
      url: Api.AddDictValue,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      data: params,
    },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
}

/**
 * @description: 获取系统字典树
 */
export function getDictTree() {
  return defHttp.get<any>({ url: Api.DictTree });
}

/**
 * @description: 根据字典类型编码获取字典数据列表
 */
export function getDicts(typeCode: string) {
  return defHttp.get<any>(
    { url: Api.DictListByCode, params: { dictTypeCode: typeCode } },
    { isTransformResponse: false },
  );
}

/**
 * @description: 根据字典类型codes获取字典数据map
 */
export function getMapDicts(typeCodes: string) {
  return defHttp.get<any>({ url: Api.DictMapByCodes, params: { dictTypeCodes: typeCodes } });
}
