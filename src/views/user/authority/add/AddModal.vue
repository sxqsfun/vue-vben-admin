<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from '../data';
  import { sync } from '../api';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AddModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, validate }] = useForm({
        //baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
        colon: true,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false, minHeight: 320 });
        isUpdate.value = !!data?.isUpdate;
      });

      const getTitle = computed(() => '权限同步');

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          const resp = await sync(values.selectServerName.toString());
          console.log(resp);
          if (resp.code == 200) {
            createMessage.success(resp.msg);
            closeModal();
            emit('success');
          } else {
            createMessage.error(resp.message);
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
