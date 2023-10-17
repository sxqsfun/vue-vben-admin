import { BasicColumn, FormSchema } from '/src/components/Table';
//表头
export const columns: BasicColumn[] = [
  {
    title: '值',
    dataIndex: 'value',
  },
  {
    title: '标签',
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
    field: 'value',
    label: '值',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '标签',
    component: 'Input',
    colProps: { span: 8 },
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
    field: 'value',
    label: '值',
    component: 'Input',
    required: true,
    itemProps: {
      colon: true,
    },
  },
  {
    field: 'code',
    label: '标签',
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
