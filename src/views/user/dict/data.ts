import { BasicColumn, FormSchema } from '/@/components/Table';
//表头
export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'name',
  },
  {
    title: '字典编码',
    dataIndex: 'code',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];
//查询表单
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '字典名称',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'code',
    label: '字典编码',
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
    label: '字典名称',
    component: 'Input',
    required: true,
    itemProps: {
      colon: true,
    },
  },
  {
    field: 'code',
    label: '字典编码',
    component: 'Input',
    itemProps: {
      colon: true,
    },
    required: true,
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
    itemProps: {
      colon: true,
    },
    componentProps: {
      min: 0,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    itemProps: {
      colon: true,
    },
  },
];
