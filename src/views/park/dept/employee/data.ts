import { BasicColumn, FormSchema } from '/@/components/Table';
import { getPostList } from '../api';

//员工表单
export const formEmployeeSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
    colProps: { span: 8 },
  },
  {
    field: 'departmentId',
    label: '所属部门',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      field: 'parentId',
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
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
    colProps: { span: 8 },
  },
  {
    component: 'ApiSelect',
    label: '所属岗位',
    field: 'postIds',
    colProps: {
      span: 8,
    },
    required: true,
    componentProps: {
      api: getPostList,
      labelField: 'name',
      valueField: 'id',
      showSearch: true,
      mode: 'multiple',
      placeholder: '请选择',
      multiple: true,
      showArrow: true,
    },
  },
  {
    field: 'name',
    label: '员工姓名',
    component: 'Input',
    required: true,
    colProps: { span: 8 },
  },
  {
    field: 'qualification',
    label: '员工学历',
    component: 'Select',
    required: true,
    componentProps: {
      placeholder: '请选择员工学历',
      options: [
        { label: '无', value: 'w' },
        { label: '小学', value: 'xx' },
        { label: '初中', value: 'cz' },
        { label: '高中', value: 'gz' },
        { label: '中专', value: 'zz' },
        { label: '大专', value: 'dz' },
        { label: '本科', value: 'bk' },
        { label: '研究生', value: 'yjs' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'idCard',
    label: '证件号码',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (!value) {
            /* eslint-disable-next-line */
                        return Promise.reject('值不能为空');
          }
          const id =
            /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
          if (id.test(value) !== true) {
            /* eslint-disable-next-line */
                        return Promise.reject('身份证格式不正确，请输入正确的身份证号码');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    componentProps(obj) {
      return {
        onChange: function (e) {
          if (e.target && e.target.value.length == 18) {
            const date = e.target.value.substring(6, 14);
            obj.formActionType.setFieldsValue({ birthDate: date });

            const birthdays = new Date(date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'));
            // 当前系统日期
            const d = new Date();
            const age =
              d.getFullYear() -
              birthdays.getFullYear() -
              (d.getMonth() < birthdays.getMonth() ||
              (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate())
                ? 1
                : 0);
            obj.formActionType.setFieldsValue({ age: age });

            //设置性别
            const genderCode = e.target.value.charAt(16);
            if (parseInt(genderCode) % 2 == 0) {
              obj.formActionType.setFieldsValue({ gender: 0 });
            } else {
              obj.formActionType.setFieldsValue({ gender: 1 });
            }
          }
        },
      };
    },
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (!value) {
            /* eslint-disable-next-line */
                        return Promise.reject('输入框不能为空');
          }
          const phoneZ =
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
          if (phoneZ.test(value) !== true) {
            /* eslint-disable-next-line */
                        return Promise.reject('手机号格式不正确，请输入重新输入');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    colProps: { span: 8 },
  },
  {
    component: 'DatePicker',
    label: '入职日期',
    field: 'employmentDate',
    required: true,
    colProps: { span: 8 },
    componentProps(obj) {
      return {
        style: {
          width: '100%',
        },
        onChange: function (e, e2) {
          const birthdays = new Date(e2);
          // 当前系统日期
          const d = new Date();
          const age =
            d.getFullYear() -
            birthdays.getFullYear() -
            (d.getMonth() < birthdays.getMonth() ||
            (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate())
              ? 1
              : 0);
          obj.formActionType.setFieldsValue({ workingYears: age });
        },
      };
    },
  },
  {
    field: 'gender',
    label: '员工性别',
    component: 'Select',
    required: true,
    componentProps: {
      placeholder: '输入证件号码自动生成',
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
      ],
    },
    colProps: { span: 8 },
    dynamicDisabled: () => {
      return true;
    },
  },
  {
    component: 'DatePicker',
    label: '出生日期',
    field: 'birthDate',
    required: true,
    colProps: { span: 8 },
    componentProps: {
      style: {
        width: '100%',
      },
      placeholder: '输入证件号码自动生成',
    },
    dynamicDisabled: () => {
      return true;
    },
  },
  {
    component: 'Input',
    label: '员工年龄',
    field: 'age',
    required: true,
    componentProps: {
      placeholder: '输入证件号码自动生成',
    },
    dynamicDisabled: () => {
      return true;
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '员工工龄',
    required: true,
    field: 'workingYears',
    componentProps: {
      placeholder: '选择入职日期自动生成',
    },
    dynamicDisabled: () => {
      return true;
    },
    colProps: { span: 8 },
  },
  {
    field: '_grid_12',
    component: 'Divider',
    label: '',
  },
  {
    field: 'professionTitle',
    label: '员工职称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'registerAddress',
    label: '户籍地址',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'currentAddress',
    label: '现居地址',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'graduationInstitution',
    label: '毕业院校',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'majorsStudied',
    label: '所学专业',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'level',
    label: '公司定级级别',
    component: 'Select',
    componentProps: {
      placeholder: '请选择级别',
      options: [
        { label: '学徒', value: 'xt' },
        { label: '初级', value: 'cj' },
        { label: '中级', value: 'zj' },
        { label: '副高级', value: 'fgj' },
        { label: '高级', value: 'gj' },
        { label: '技师', value: 'js' },
        { label: '一档', value: 'yd' },
        { label: '二挡', value: 'ed' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    component: 'DatePicker',
    label: '劳动关系开始时间',
    field: 'jobStartDate',
    colProps: { span: 8 },
    componentProps(obj) {
      return {
        style: {
          width: '100%',
        },
        onChange: function (e, e2) {
          if (obj.formActionType.getFieldsValue().jobEndDate) {
            // 当前劳动关系结束时间
            const jobEndDate = obj.formActionType.getFieldsValue().jobEndDate;

            const d1 = new Date(jobEndDate);
            const d2 = new Date(e2);
            const value =
              d1.getFullYear() -
              d2.getFullYear() -
              (d1.getMonth() < d2.getMonth() ||
              (d1.getMonth() == d2.getMonth() && d1.getDate() < d2.getDate())
                ? 1
                : 0);
            obj.formActionType.setFieldsValue({ contractTerm: value });
          }
        },
      };
    },
  },
  {
    component: 'Input',
    label: '劳动合同年限',
    field: 'contractTerm',
    componentProps: {
      placeholder: '选择劳动关系开始结束时间生成',
    },
    dynamicDisabled: () => {
      return true;
    },
    colProps: { span: 8 },
  },
  {
    component: 'DatePicker',
    label: '劳动关系结束时间',
    field: 'jobEndDate',
    colProps: { span: 8 },
    componentProps(obj) {
      return {
        style: {
          width: '100%',
        },
        onChange: function (e, e2) {
          if (obj.formActionType.getFieldsValue().jobStartDate) {
            // 当前劳动关系开始时间
            const jobStartDate = obj.formActionType.getFieldsValue().jobStartDate;

            const d1 = new Date(jobStartDate);
            const d2 = new Date(e2);
            const value =
              d2.getFullYear() -
              d1.getFullYear() -
              (d2.getMonth() < d1.getMonth() ||
              (d2.getMonth() == d1.getMonth() && d2.getDate() < d1.getDate())
                ? 1
                : 0);
            obj.formActionType.setFieldsValue({ contractTerm: value });
          }
        },
      };
    },
  },
];

export const formEmployeeDetailsSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
    colProps: { span: 8 },
  },
  {
    field: 'isDetails',
    label: 'isDetails',
    component: 'Input',
    show: false,
    colProps: { span: 8 },
  },
  {
    field: 'deptName',
    label: '所属部门',
    component: 'InputTextArea',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '所属岗位',
    field: 'postName',
    colProps: {
      span: 8,
    },
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
        };
      }
    },
  },
  {
    field: 'name',
    label: '员工姓名',
    component: 'Input',
    colProps: { span: 8 },
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
        };
      }
    },
  },
  {
    field: 'qualification',
    label: '员工学历',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'idCard',
    label: '证件号码',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
          onChange: function (e) {
            if (e.target && e.target.value.length == 18) {
              const date = e.target.value.substring(6, 14);
              obj.formActionType.setFieldsValue({ birthDate: date });

              const birthdays = new Date(date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'));
              // 当前系统日期
              const d = new Date();
              const age =
                d.getFullYear() -
                birthdays.getFullYear() -
                (d.getMonth() < birthdays.getMonth() ||
                (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate())
                  ? 1
                  : 0);
              obj.formActionType.setFieldsValue({ age: age });

              //设置性别
              const genderCode = e.target.value.charAt(16);
              if (parseInt(genderCode) % 2 == 0) {
                obj.formActionType.setFieldsValue({ gender: 0 });
              } else {
                obj.formActionType.setFieldsValue({ gender: 1 });
              }
            }
          },
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '入职日期',
    field: 'employmentDate',
    colProps: { span: 8 },
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
          onChange: function (e, e2) {
            const birthdays = new Date(e2);
            // 当前系统日期
            const d = new Date();
            const age =
              d.getFullYear() -
              birthdays.getFullYear() -
              (d.getMonth() < birthdays.getMonth() ||
              (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate())
                ? 1
                : 0);
            obj.formActionType.setFieldsValue({ workingYears: age });
          },
        };
      }
    },
  },
  {
    field: 'gender',
    label: '员工性别',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '出生日期',
    field: 'birthDate',
    colProps: { span: 8 },
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
  },
  {
    component: 'Input',
    label: '员工年龄',
    field: 'age',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '员工工龄',
    field: 'workingYears',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'jobStatus',
    label: '在职状态',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: '_grid_12',
    component: 'Divider',
    label: '',
  },
  {
    field: 'professionTitle',
    label: '员工职称',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'registerAddress',
    label: '户籍地址',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'currentAddress',
    label: '现居地址',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'graduationInstitution',
    label: '毕业院校',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'majorsStudied',
    label: '所学专业',
    component: 'Input',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    field: 'level',
    label: '公司定级级别',
    component: 'Input',
    componentProps: {
      readonly: true,
      clearable: false,
      bordered: false,
      placeholder: '--',
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '劳动关系开始时间',
    field: 'jobStartDate',
    colProps: { span: 8 },
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
          onChange: function (e, e2) {
            if (obj.formActionType.getFieldsValue().jobEndDate && e2) {
              // 当前劳动关系结束时间
              const jobEndDate = obj.formActionType.getFieldsValue().jobEndDate;

              const d1 = new Date(jobEndDate);
              const d2 = new Date(e2);
              const value =
                d1.getFullYear() -
                d2.getFullYear() -
                (d1.getMonth() < d2.getMonth() ||
                (d1.getMonth() == d2.getMonth() && d1.getDate() < d2.getDate())
                  ? 1
                  : 0);
              obj.formActionType.setFieldsValue({ contractTerm: value });
            }
          },
        };
      }
    },
  },
  {
    component: 'Input',
    label: '劳动合同年限',
    field: 'contractTerm',
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
        };
      }
    },
    colProps: { span: 8 },
  },
  {
    component: 'Input',
    label: '劳动关系结束时间',
    field: 'jobEndDate',
    colProps: { span: 8 },
    componentProps(obj) {
      if (obj?.formModel?.isDetails) {
        return {
          readonly: true,
          clearable: false,
          bordered: false,
          placeholder: '--',
          onChange: function (e, e2) {
            if (obj.formActionType.getFieldsValue().jobStartDate && e2) {
              // 当前劳动关系开始时间
              const jobStartDate = obj.formActionType.getFieldsValue().jobStartDate;

              const d1 = new Date(jobStartDate);
              const d2 = new Date(e2);
              const value =
                d2.getFullYear() -
                d1.getFullYear() -
                (d2.getMonth() < d1.getMonth() ||
                (d2.getMonth() == d1.getMonth() && d2.getDate() < d1.getDate())
                  ? 1
                  : 0);
              obj.formActionType.setFieldsValue({ contractTerm: value });
            }
          },
        };
      }
    },
  },
];

//员工表格
export const employeeColumns: BasicColumn[] = [
  {
    title: '员工姓名',
    dataIndex: 'name',
    align: 'center',
    width: 100,
  },
  {
    title: '员工工号',
    dataIndex: 'code',
    align: 'center',
    width: 100,
  },
  {
    title: '所属部门',
    dataIndex: 'deptName',
    align: 'center',
    width: 300,
  },
  {
    title: '所属岗位',
    dataIndex: 'postName',
    align: 'center',
    width: 200,
  },
  {
    title: '所属班组',
    dataIndex: 'teamName',
    align: 'center',
    width: 160,
    customRender: ({ record }) => {
      if (!record.teamName) {
        return '--';
      }
      const text = record.teamName == null ? '--' : record.teamName;
      return text;
    },
  },
  {
    title: '性别',
    dataIndex: 'gender',
    align: 'center',
    width: 100,
    customRender: ({ record }) => {
      const text = record.gender == 1 ? '男' : '女';
      return text;
    },
  },
  {
    title: '员工职称',
    dataIndex: 'professionTitle',
    align: 'center',
    width: 130,
    customRender: ({ record }) => {
      if (!record.professionTitle) {
        return '--';
      }
    },
  },
  {
    title: '户籍地址',
    dataIndex: 'registerAddress',
    align: 'center',
    width: 200,
    customRender: ({ record }) => {
      if (!record.registerAddress) {
        return '--';
      }
    },
  },
  {
    title: '现居地址',
    dataIndex: 'currentAddress',
    align: 'center',
    width: 200,
    customRender: ({ record }) => {
      if (!record.currentAddress) {
        return '--';
      }
    },
  },
  {
    title: '出生日期',
    dataIndex: 'birthDate',
    align: 'center',
    width: 130,
  },
  {
    title: '员工学历',
    dataIndex: 'qualification',
    ifShow: false,
  },
  {
    title: '员工学历',
    dataIndex: 'qualificationDesc',
    align: 'center',
    width: 100,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    align: 'center',
    width: 130,
  },
  {
    title: '入职时间',
    dataIndex: 'employmentDate',
    align: 'center',
    width: 130,
  },
  {
    title: '身份证号码',
    dataIndex: 'idCard',
    align: 'center',
    width: 160,
  },
  {
    title: '在职状态',
    dataIndex: 'jobStatus',
    align: 'center',
    width: 100,
    customRender: ({ record }) => {
      if (record.jobStatus == 'zz') {
        return '在职';
      } else if (record.jobStatus == 'lz') {
        return '离职';
      }
    },
  },
  {
    title: '员工年龄',
    dataIndex: 'age',
    align: 'center',
    width: 100,
    customRender: ({ record }) => {
      const birthdays = new Date(record.birthDate);
      // 当前系统日期
      const d = new Date();
      const age =
        d.getFullYear() -
        birthdays.getFullYear() -
        (d.getMonth() < birthdays.getMonth() ||
        (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate())
          ? 1
          : 0);
      return age + '岁';
    },
  },
  {
    title: '员工工龄',
    dataIndex: 'workingYears',
    align: 'center',
    width: 100,
    customRender: ({ record }) => {
      const date = new Date(record.employmentDate);
      // 当前系统日期
      const d = new Date();
      const workingYears =
        d.getFullYear() -
        date.getFullYear() -
        (d.getMonth() < date.getMonth() ||
        (d.getMonth() == date.getMonth() && d.getDate() < date.getDate())
          ? 1
          : 0);
      return workingYears + '年';
    },
  },
  {
    title: '劳动关系开始时间',
    dataIndex: 'jobStartDate',
    align: 'center',
    width: 130,
    customRender: ({ record }) => {
      if (!record.jobStartDate) {
        return '--';
      }
    },
  },
  {
    title: '劳动合同年限',
    dataIndex: 'contractTerm',
    align: 'center',
    width: 120,
    customRender: ({ record }) => {
      if (!record.jobStartDate || !record.jobEndDate) {
        return '--';
      }
      const d1 = new Date(record.jobStartDate);
      const d2 = new Date(record.jobEndDate);
      const value =
        d2.getFullYear() -
        d1.getFullYear() -
        (d2.getMonth() < d1.getMonth() ||
        (d2.getMonth() == d1.getMonth() && d2.getDate() < d1.getDate())
          ? 1
          : 0);
      return value + '年';
    },
  },
  {
    title: '劳动关系结束时间',
    dataIndex: 'jobEndDate',
    align: 'center',
    width: 130,
    customRender: ({ record }) => {
      if (!record.jobEndDate) {
        return '--';
      }
    },
  },
  {
    title: '公司定级级别',
    dataIndex: 'level',
    align: 'center',
    ifShow: false,
  },
  {
    title: '公司定级级别',
    dataIndex: 'levelDesc',
    align: 'center',
    width: 100,
    customRender: ({ record }) => {
      if (!record.level) {
        return '--';
      }
    },
  },
  {
    title: '毕业院校',
    dataIndex: 'graduationInstitution',
    align: 'center',
    width: 160,
    customRender: ({ record }) => {
      if (!record.graduationInstitution) {
        return '--';
      }
    },
  },
  {
    title: '所学专业',
    dataIndex: 'majorsStudied',
    align: 'center',
    width: 160,
    customRender: ({ record }) => {
      if (!record.majorsStudied) {
        return '--';
      }
    },
  },
  {
    title: '员工头像',
    dataIndex: 'headerImg',
    align: 'center',
    width: 160,
  },
  {
    title: '身份证正面照',
    dataIndex: 'backSide',
    align: 'center',
    width: 160,
  },
  {
    title: '身份证反面照',
    dataIndex: 'frontSide',
    align: 'center',
    width: 160,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    align: 'center',
    width: 130,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 160,
  },
];

/**
 * 员工搜索表单
 */
export const searchSchema: FormSchema[] = [
  {
    field: 'name',
    label: '员工姓名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    colProps: { span: 6 },
  },
  {
    field: 'code',
    label: '员工工号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    colProps: { span: 6 },
  },
  {
    field: 'gender',
    label: '员工性别',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    colProps: { span: 6 },
  },
  {
    field: 'jobStatus',
    label: '在职状态',
    component: 'Select',
    defaultValue: 'zz',
    componentProps: {
      options: [
        { label: '在职', value: 'zz' },
        { label: '离职', value: 'lz' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'employmentDate',
    label: '入职日期',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间'],
    },
  },
  {
    field: 'creatorName',
    label: '创建人',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'createTime',
    label: '创建日期',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间'],
    },
  },
];
