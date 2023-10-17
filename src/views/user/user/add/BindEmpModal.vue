<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="1250px"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" />
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { bindEmp, getEmpSelectList } from '../api';
  import { empColumns, searchEmpFormSchema } from '../data';

  export default defineComponent({
    name: 'BindEmpModal',
    components: { BasicModal, BasicForm, BasicTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();

      const [registerTable, { reload, getSelectRowKeys, getForm }] = useTable({
        api: getEmpSelectList,
        rowKey: 'id',
        columns: empColumns,
        formConfig: {
          labelWidth: 120,
          schemas: searchEmpFormSchema,
          colon: true,
        },
        rowSelection: { type: 'radio' },
        clickToRowSelect: false,
        useSearchForm: true,
        showIndexColumn: true,
        striped: true,
        bordered: true,
        canResize: false,
        ellipsis: true,
      });

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: [
          {
            field: 'id',
            label: 'id',
            component: 'Input',
            show: false,
          },
        ],
        showActionButtonGroup: false,
        colon: true,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });

        setFieldsValue({
          ...data.record,
        });

        getForm().resetFields();

        reload();
      });

      const getTitle = '选择要绑定的员工';

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });

          const keys = getSelectRowKeys();
          if (keys.length != 1) {
            createMessage.info('请选择要绑定的员工信息');
          } else {
            let params = { userId: values.id, employeeId: keys[0] };
            const result = await bindEmp(params);
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              closeModal();
              emit('success');
            } else {
              createMessage.error(result.msg);
            }
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, registerTable, getTitle, handleSubmit };
    },
  });
</script>
