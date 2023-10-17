import { BasicFetchResult } from '/@/api/model/baseModel';

export interface RoleParams {
  id?: number;
  name: string;
  remark?: string;
}

export interface RoleListItem {
  name: string;
  createTime: string;
  creator: number;
  creatorName: string;
  id: string;
  isDeleted: Boolean;
  modifier: number;
  modifierName: string;
  remark: string;
  updateTime: string;
}

export type RoleListResultModel = BasicFetchResult<RoleListItem>;
