import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'code',
    label: '部门编码',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '部门名称',
    component: 'Input',
    required: true,
  },
  // {
  //     field: 'employeeId',
  //     label: '负责人',
  //     component: 'ApiSelect',
  //     componentProps: {
  //         api: getDeptUserList,
  //         labelField: 'employeeVO.name',
  //         valueField: 'id',
  //         showSearch: true,
  //         placeholder: "请选择",
  //         showArrow:true,
  //         // defaultOpen: true,
  //         style:{

  //         }
  //     },
  // },
  {
    field: 'status',
    label: '部门状态',
    component: 'RadioButtonGroup',
    required: true,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
  {
    field: 'parentId',
    label: '上级部门',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      field: 'parentId',
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
    field: 'isSublevelDept',
    label: 'isSublevelDept',
    component: 'Input',
    show: false,
  },
  {
    field: 'isEmployee',
    label: 'isEmployee',
    component: 'Input',
    show: false,
  },
];

/**
 * 部门负责人表格数据
 */
export const departmentHeadColumns: BasicColumn[] = [
  {
    title: '部门编码',
    dataIndex: 'code',
    align: 'center',
  },
  {
    title: '部门名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '部门状态',
    dataIndex: 'status',
    align: 'center',
    customRender: ({ record }) => {
      const status = record.status;
      const color = status == 1 ? 'green' : 'red';
      const text = status == 1 ? '启用' : '停用';
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
