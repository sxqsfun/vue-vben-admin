import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'jobName',
    align: 'center',
  },
  {
    title: '任务分组',
    dataIndex: 'jobGroup',
    align: 'center',
  },
  {
    title: '任务描述',
    dataIndex: 'jobDescription',
    align: 'center',
  },
  {
    title: '任务状态',
    dataIndex: 'jobStatus',
    align: 'center',
  },
  {
    title: '任务表达式',
    dataIndex: 'cronExpression',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'jobName',
    label: '任务名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'jobName',
    label: '任务名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'jobGroup',
    label: '任务分组',
    component: 'Input',
    required: true,
  },
  {
    field: 'jobDescription',
    label: '任务描述',
    component: 'Input',
    required: true,
  },
  {
    field: 'cronExpression',
    label: '任务表达式',
    component: 'Input',
    required: true,
  },
];
