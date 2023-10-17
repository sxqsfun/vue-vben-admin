<template>
  <BasicModal v-bind="$attrs" @register="registerModal11" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="register" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { formSchema } from './updatePwd.data';
  import { useUserStore } from '/@/store/modules/user';
  import { UpdatePwd } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, BasicModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [register, { validate, setFieldsValue, resetFields }] = useForm({
        size: 'large',
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });
      const getTitle = computed(() => '修改密码');
      const { createMessage } = useMessage();
      const [registerModal11, { setModalProps, closeModal }] = useModalInner(async () => {
        resetFields();
        setModalProps({ confirmLoading: false });
        setFieldsValue({});
      });
      async function handleSubmit() {
        try {
          const values = await validate();
          const { passwordOld, passwordNew } = values;
          console.log(passwordOld, passwordNew);
          //修改密码
          const result = await UpdatePwd({
            id: useUserStore().getUserInfo.userId,
            pwd: passwordNew,
          });
          if (result.code != 200) {
            createMessage.error(result.msg);
            return;
          }
          createMessage.success(result.msg);
          closeModal();
          emit('success');
        } catch (error) {
          /* empty */
        }
      }

      return {
        register,
        resetFields,
        handleSubmit,
        registerModal11,
        getTitle,
      };
    },
  });
</script>
