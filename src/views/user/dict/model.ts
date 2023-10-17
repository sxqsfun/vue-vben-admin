import { BasicFetchResult } from '/@/api/model/baseModel';
/**
 * @param name 字典类型名称；
 * @param code 字典类型编码；
 * @param sort 排序;
 * @param remark 备注;
 */
export interface dictTypeParams {
  id?: number;
  name?: string;
  code?: string;
  sort?: number;
  remark?: string;
}
/**
 * @param name 字典类型名称；
 * @param code 字典类型编码；
 * @param sort 排序;
 * @param remark 备注;
 */
export interface dictTypeResult {
  id: number;
  name: string;
  code: string;
  sort: number;
  remark: string;
}

export interface dictDataParams {
  id?: number;
  value?: string;
  code?: string;
  sort?: number;
  remark?: string;
}
export interface dictDataResult {
  id: number;
  value: string;
  code: string;
  sort: number;
  remark: string;
}
export type dictTypeResultModel = BasicFetchResult<dictTypeResult>;
export type dictDataResultModel = BasicFetchResult<dictDataResult>;
