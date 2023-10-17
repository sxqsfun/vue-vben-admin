<template>
  <BasicModal v-bind="$attrs" @register="registerModal2" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerValueForm2" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/src/components/Modal';
  import { BasicForm, useForm } from '/src/components/Form';
  import { formSchema } from './dictvalue.data';
  import { useMessage } from '/src/hooks/web/useMessage';
  import { ResultEnum } from '/src/enums/httpEnum';
  import { AddDictValue, UpdateDictValue } from '../api';

  export default defineComponent({
    name: 'ValueModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const typeId = ref('');
      const { createMessage } = useMessage();
      const [registerValueForm2, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal2, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        typeId.value = data.typeId;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增字典值' : '编辑字典值'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          values.typeId = typeId.value;
          // 添加字典值/修改字典值
          if (isUpdate.value) {
            //修改
            const result = await UpdateDictValue(values);
            if (result.code != ResultEnum.SUCCESS) {
              createMessage.error(result.msg);
              return;
            }
            createMessage.success(result.msg);
          } else {
            //添加
            const result = await AddDictValue(values);
            if (result.code != ResultEnum.SUCCESS) {
              createMessage.error(result.msg);
              return;
            }
            createMessage.success(result.msg);
          }

          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal2, registerValueForm2, getTitle, handleSubmit };
    },
  });
</script>
