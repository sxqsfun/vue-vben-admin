<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, h, unref, toRaw, isProxy } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from '../data';
  import { UpdateUser, AddUser, GetRoleList } from '../api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const rowData = ref([] as any);
      const { createMessage } = useMessage();
      const userInfo = useUserStore().getUserInfo;
      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
        searchShow: false,
        colon: true,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        rowData.value = data;
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          //设置回显数据
          data.record.roleIds = data.record.roles.map((k) => k.id);
          data.record.departmentId = data.record.departmentId != 0 ? data.record.departmentId : '';
          let img = data.record.headerImg;
          data.record.headerImg = [];
          if (img && img.length > 0) {
            data.record.headerImg.push(isProxy(img) ? toRaw(img)[0] : img);
          }
          setFieldsValue({
            ...data.record,
          });
        }
        updateSchema([
          {
            field: 'roleIds',
            component: 'ApiSelect',
            componentProps: {
              // more details see /src/components/Form/src/components/ApiSelect.vue
              api: GetRoleList,
              resultField: 'data',
              // use name as label
              labelField: 'name',
              // use id as value
              valueField: 'id',
              // not request untill to select
              immediate: true,
              onChange: (e, v) => {
                console.log('roleIds->', e, v);
              },
              multiple: false,
              showArrow: false,
              mode: 'multiple',
              showSearch: true,
              optionFilterProp: 'label',
              // atfer request callback
              onOptionsChange: (options) => {
                console.log('roleIds==>', options.length, options);
              },
            },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账户' : '编辑账户'));

      async function handleSubmit() {
        try {
          const values = await validate();

          //是否修改了角色
          let updateRole = true;
          if (rowData?.value?.record?.roleIds) {
            const rIds = rowData.value.record.roleIds;
            if (values.roleIds.length != rIds.length) {
              updateRole = true;
            } else {
              updateRole = !rIds.some((item) => values.roleIds.some((r) => item == r));
            }
          }

          values.roleIds = values.roleIds.join(',');

          setModalProps({ confirmLoading: true });
          // 添加用户/修改用户
          if (isUpdate.value) {
            //修改
            const result = await UpdateUser(values);
            if (result.code != ResultEnum.SUCCESS) {
              createMessage.error(result.msg);
              return;
            }
            createMessage.success(result.msg);
          } else {
            //添加
            const result = await AddUser(values);
            if (result.code != ResultEnum.SUCCESS) {
              createMessage.error(result.msg);
              return;
            }
            createMessage.success(result.msg);
          }

          closeModal();
          if (isUpdate.value && values.id === userInfo.id && updateRole) {
            window.location.reload();
          }
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
