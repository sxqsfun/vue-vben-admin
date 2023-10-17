<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { formSchema } from '../data';
  import { addDeptAddOrUpdate, updateDeptAddOrUpdate, getDeptTree } from '../api';

  export default defineComponent({
    name: 'AddModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
        colon: true,
        searchShow: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        //这种方式存在BUG componentProps treeData为数组类型 更新时如果与之前不相同 则会进行合并而不是替代 已修改底层为替代模式
        const treeData = await getDeptTree(); //加载菜单树
        updateSchema({
          field: 'parentId',
          componentProps: { treeData },
        });

        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });

          if (isUpdate.value) {
            const result = await updateDeptAddOrUpdate(values); //修改部门
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              closeModal();
              emit('success');
            } else {
              createMessage.error(result.msg);
            }
          } else {
            const result = await addDeptAddOrUpdate(values); //添加部门
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

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
