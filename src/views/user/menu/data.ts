import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import { getPageUrlList } from './api';

const isDir = (type: number) => type === 0;
const isMenu = (type: number) => type === 1;

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '排序',
    dataIndex: 'sortNumber',
    align: 'center',
  },
  {
    title: '路由地址',
    dataIndex: 'url',
    align: 'center',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    align: 'center',
  },
  {
    title: '权限标识',
    dataIndex: 'authority',
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
    field: 'keyword',
    label: '菜单名称',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      // resultField: 'data',
      labelField: 'name',
      keyField: 'id',
      valueField: 'id',
      // loading: true,
      showSearch: true,
      treeNodeFilterProp: 'name',
      // filterTreeNode: (v, n) => { //自定义筛选 默认按treeNodeFilterProp筛选
      //   return n.props.name.includes(v);
      // },
      treeLine: true,
      treeDefaultExpandAll: true,
      allowClear: false,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'url2',
    label: '路由地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isDir(values.type),
  },
  {
    field: 'url',
    label: '路由地址',
    component: 'ApiSelect',
    itemProps: { validateTrigger: 'blur' },
    componentProps(formModel) {
      return {
        api: getPageUrlList,
        labelField: 'pageUrl',
        valueField: 'pageUrl',
        showSearch: true,
        placeholder: '请选择',
        multiple: false,
        showArrow: true,
        alwaysLoad: true,
        onChange: function (e, e2) {
          //级联操作
          if (e2) {
            formModel.formActionType.setFieldsValue({
              authority: e2.authority,
              component: e2.value + '/index',
            });
          }
        },
      };
    },
    required: true,
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'authority',
    label: '权限标识',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isDir(values.type),
  },
  {
    field: 'sortNumber',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    // required: ({ values }) => isDir(values.type),
  },
];
