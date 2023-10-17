import { BasicColumn, FormSchema } from '/@/components/Table';
//表头
export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色描述',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];
//查询表单
export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '角色名称',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 6 },
  },
];
//添加表单列
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    required: true,
    itemProps: {
      colon: true,
    },
  },
  {
    field: 'remark',
    label: '角色描述',
    component: 'Input',
    itemProps: {
      colon: true,
    },
  },
];
