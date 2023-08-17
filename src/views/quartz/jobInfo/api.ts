import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { JobQueryParams, JobParams, JobModel } from './model';

/**
 * 定时任务API
 */
enum Api {
  GetJobList = '/quartz/admin/jobInfo/list',
  AddJob = '/quartz/admin/jobInfo/add',
  UpdateJob = '/quartz/admin/jobInfo/update',
  DelJob = '/quartz/admin/jobInfo/delete',
  // StartJob = '/quartz/admin/jobInfo/delete',
  PauseJob = '/quartz/admin/jobInfo/pause',
  ResumeJob = '/quartz/admin/jobInfo/resume',
}

export const getJobList = (params: JobQueryParams) =>
  defHttp.get<JobModel>(
    { url: Api.GetJobList, params },
    { isTransformResponse: false, errorMessageMode: 'message' },
  );

/**
 * @description: 添加任务
 */
export const addJob = (params: JobParams) =>
  defHttp.post<any>(
    { url: Api.AddJob, headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED }, data: params },
    { isTransformResponse: false },
  );

/**
 * @description: 修改任务
 */
export const updateJob = (params: JobParams) =>
  defHttp.put<any>(
    {
      url: Api.UpdateJob,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 删除任务
 */
export const delJob = (params: JobParams) =>
  defHttp.delete<any>(
    { url: Api.DelJob, headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED }, data: params },
    { isTransformResponse: false },
  );

/**
 * @description: 暂停任务
 */
export const pauseJob = (params: JobParams) =>
  defHttp.put<any>(
    {
      url: Api.PauseJob,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );

/**
 * @description: 恢复任务
 */
export const resumeJob = (params: JobParams) =>
  defHttp.put<any>(
    {
      url: Api.ResumeJob,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: params,
    },
    { isTransformResponse: false },
  );
