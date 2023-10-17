<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from '../data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getMenuTreeList, addMenu, updateMenu } from '../api';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AddDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
        colon: true,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        try {
          resetFields();
          setDrawerProps({ confirmLoading: true });
          isUpdate.value = !!data?.isUpdate;

          //这种方式存在BUG componentProps treeData为数组类型 更新时如果与之前不相同 则会进行合并而不是替代 已修改底层为替代模式
          const treeData = await getMenuTreeList({ top: true }); //加载菜单树
          updateSchema({
            field: 'parentId',
            componentProps: { treeData },
          });

          if (!isUpdate.value) {
            if (data?.record) {
              setFieldsValue({ parentId: data.record.id });
            } else {
              setFieldsValue({ parentId: '-1' });
            }
          }

          if (unref(isUpdate)) {
            data.record.url2 = data.record.url;
            setFieldsValue({
              ...data.record,
            });
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();
          if (values.type == 0) {
            values.url = values.url2;
            values.component = '';
            values.authority = '';
          }
          setDrawerProps({ confirmLoading: true });
          if (isUpdate.value) {
            const result = await updateMenu(values);
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              closeDrawer();
              emit('success');
            } else {
              createMessage.error(result.msg);
            }
          } else {
            const result = await addMenu(values);
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              closeDrawer();
              emit('success');
            } else {
              createMessage.error(result.msg);
            }
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
