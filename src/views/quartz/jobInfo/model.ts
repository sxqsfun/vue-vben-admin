import { BasicFetchResult } from '/@/api/model/baseModel';

/**
 * 定时任务-查询参数
 */
export interface JobQueryParams {
  jobName: string;
}

/**
 * 定时任务-表单参数
 */
export interface JobParams {
  jobName: string;
  jobGroup: string;
  jobDescription?: number;
  cronExpression?: number;
}

/**
 * 定时任务信息
 */
export interface JobModel {
  jobName: string;
  jobGroup: string;
  jobDescription: number;
  jobStatus: string;
  cronExpression: number;
  createTime: string;
}

export type JobModelResult = BasicFetchResult<JobModel>;
