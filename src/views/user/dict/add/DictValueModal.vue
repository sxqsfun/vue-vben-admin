<template>
  <BasicModal
    v-bind="$attrs"
    :showOkBtn="false"
    :showCancelBtn="false"
    @register="register"
    :title="getTitle"
    width="1200px"
  >
    <BasicTable @register="registerTableValue">
      <template #toolbar>
        <a-button type="primary" @click="addHandle" v-if="hasPermission('添加字典值')"
          >新增</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '修改',
                icon: 'clarity:note-edit-line',
                tooltip: '修改字典值',
                onClick: updateHandle.bind(null, record),
                auth: '修改字典值',
              },
              {
                label: '删除',
                icon: 'ant-design:delete-outlined',
                tooltip: '删除字典值',
                color: 'error',
                popConfirm: {
                  title: '是否删除',
                  confirm: deleteHandle.bind(null, record),
                },
                auth: '删除字典值',
              },
            ]"
            :dropDownActions="[]"
          />
        </template>
      </template>
    </BasicTable>
    <ValueModal @register="registerModal1" @success="handleSuccess" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getDictValuePage, DeleteDictValue } from '../api';
  import ValueModal from './ValueModal.vue';
  import { columns, searchFormSchema } from './dictvalue.data';
  import { useModal, BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'DictValueManager',
    components: { BasicTable, BasicModal, TableAction, ValueModal },
    setup() {
      const { hasPermission } = usePermission();
      const [registerModal1, { openModal }] = useModal();
      const { createMessage } = useMessage();
      const searchInfo = ref('');
      const [registerTableValue, { reload }] = useTable({
        title: '',
        api: getDictValuePage,
        beforeFetch: (params) => {
          return Object.assign(params, { typeId: searchInfo.value });
        },
        rowKey: 'id',
        columns,
        formConfig: {
          //查询区域设置
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
          colon: true,
        },
        useSearchForm: hasPermission('搜索字典值'),
        showIndexColumn: true,
        striped: true,
        showTableSetting: true,
        bordered: true,
        canResize: false,
        ellipsis: true,
        actionColumn: {
          width: 240,
          title: '操作',
          dataIndex: 'action',
        },
      });
      const getTitle = computed(() => '字典值');

      //删除字典类型
      async function deleteHandle(record: Recordable) {
        const result = await DeleteDictValue({ id: record.id });
        if (result.code != ResultEnum.SUCCESS) {
          createMessage.error(result.msg);
          return;
        }
        createMessage.success(result.msg);
        reload();
      }
      //修改字典类型
      function updateHandle(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
          typeId: searchInfo.value,
        });
      }
      //添加类型
      function addHandle() {
        openModal(true, {
          isUpdate: false,
          typeId: searchInfo.value,
        });
      }
      const [register, { setModalProps }] = useModalInner(async (data) => {
        console.log(data.record.id);

        setModalProps({ confirmLoading: false });
        searchInfo.value = data.record.id;
        reload();
      });
      function handleSuccess() {
        reload();
      }

      return {
        getTitle,
        hasPermission,
        updateHandle,
        register,
        addHandle,
        deleteHandle,
        registerTableValue,
        registerModal1,
        handleSuccess,
      };
    },
  });
</script>
