import { BasicColumn, FormSchema } from '/@/components/Table';
import { Upload } from './api';
// import { getDeptTreeList } from '/@/api/zone/dept/dept';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '账户名称',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: '所属角色',
    dataIndex: 'roleNames',
    align: 'center',
  },
  // {
  //   title: '所属部门',
  //   dataIndex: 'deptName',
  //   align: 'center',
  // },
  {
    title: '绑定员工',
    dataIndex: 'employeeName',
    align: 'center',
    customRender: ({ record }) => {
      const text = record.employeeName;
      if (text) {
        return h(Tag, { color: 'green' }, () => text);
      } else {
        return '';
      }
    },
  },
  // {
  //   title: '联系电话',
  //   dataIndex: 'phone',
  //   align: 'center',
  // },
  {
    title: '账户状态',
    dataIndex: 'status',
    align: 'center',
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
];

export const empColumns: BasicColumn[] = [
  {
    title: '员工姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '员工工号',
    dataIndex: 'code',
    align: 'center',
  },
  {
    title: '所属部门',
    dataIndex: 'departmentName',
    align: 'center',
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '账户绑定',
    dataIndex: 'isBindAccount',
    align: 'center',
    customRender: ({ record }) => {
      const status = record.isBindAccount;
      const color = status ? 'green' : 'red';
      const text = status ? '已绑定' : '未绑定';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '账户名称',
    dataIndex: 'account',
    align: 'center',
  },
];

//用户管理-搜索表单
export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '账户名称',
    labelWidth: 100,
    component: 'Input',
  },
  // {
  //   field: 'phone',
  //   label: '联系电话',
  //   labelWidth: 100,
  //   component: 'Input',
  //   colProps: { span: 4 },
  // },
  {
    field: 'createTime',
    label: '创建日期',
    labelWidth: 100,
    component: 'RangePicker',
    componentProps: {
      style: {
        width: '100%',
      },
      format: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间'],
    },
  },
  // {
  //   field: 'departmentId',
  //   label: '所属部门',
  //   labelWidth: 100,
  //   component: 'ApiTreeSelect',
  //   colProps: { span: 4 },
  //   componentProps: {
  //     api: getDeptTreeList,
  //     field: 'parentId',
  //     fieldNames: {
  //       label: 'name',
  //       key: 'id',
  //       value: 'id',
  //     },
  //     showSearch: true,
  //     treeNodeFilterProp: 'name',
  //     treeLine: true,
  //     treeDefaultExpandAll: true,
  //     allowClear: true,
  //     dropdownMatchSelectWidth: 400,
  //     getPopupContainer: () => document.body,
  //   },
  // },
];

//用户管理-绑定员工-搜索表单
export const searchEmpFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '员工姓名',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 5 },
  },
  {
    field: 'code',
    label: '员工工号',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 5 },
  },
  {
    field: 'idCard',
    label: '身份证号',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 5 },
  },
  {
    field: 'phone',
    label: '手机号码',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 5 },
  },
];

//用户信息表单
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'username',
    label: '账户名称',
    component: 'Input',
    required: true,
    componentProps(obj) {
      if (obj?.formModel?.id) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
        };
      }
    },
  },
  // {
  //   field: 'phone',
  //   label: '联系电话',
  //   component: 'Input',
  //   rules: [
  //     {
  //       required: true,
  //       pattern: new RegExp(/^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/),
  //       message: '电话号码格式错误',
  //       trigger: 'blur'
  //     },
  //   ],
  // },
  {
    field: 'roleIds',
    label: '所属角色',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  // {
  //   field: 'departmentId',
  //   label: '所属部门',
  //   component: 'ApiTreeSelect',
  //   componentProps: {
  //     api: getDeptTreeList,
  //     field: 'parentId',
  //     fieldNames: {
  //       label: 'name',
  //       key: 'id',
  //       value: 'id',
  //     },
  //     showSearch: true,
  //     treeNodeFilterProp: 'name',
  //     treeLine: true,
  //     treeDefaultExpandAll: true,
  //     allowClear: true,
  //     getPopupContainer: () => document.body,
  //   },
  // },
  {
    field: 'status',
    label: '账户状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
  {
    field: 'headerImg',
    label: '账户头像',
    component: 'Upload',
    componentProps: {
      api: Upload,
      multiple: false,
      accept: ['image/*'],
      name: 'headerImg',
      maxNumber: 1,
      emptyHidePreview: true,
    },
  },
];
