<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="add" v-if="hasPermission('添加类型')">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '修改',
                icon: 'clarity:note-edit-line',
                onClick: update.bind(null, record),
                tooltip: '修改字典',
                auth: '修改类型',
              },
              {
                label: '删除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除字典',
                popConfirm: {
                  title: '是否删除',
                  confirm: deleteType.bind(null, record),
                },
                auth: '删除类型',
              },
              {
                label: '字典',
                icon: 'ic:outline-delete-outline',
                tooltip: '字典值',
                onClick: openDict.bind(null, record),
                auth: '搜索字典值',
              },
            ]"
            :dropDownActions="[]"
          />
        </template>
      </template>
    </BasicTable>
    <DictModal @register="registerDictModal" @success="handleSuccess" />
    <DictValueModal @register="registerDictValueModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getDictTypeList, DeleteDictType } from './api';
  import DictModal from './add/modal.vue';
  import DictValueModal from './add/DictValueModal.vue';
  import { columns, searchFormSchema } from './data';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'DictTypeManagement',
    components: { BasicTable, TableAction, DictModal, DictValueModal },
    setup() {
      const { hasPermission } = usePermission();
      const [registerDictModal, { openModal }] = useModal();
      const [registerDictValueModal, { openModal: valueModel }] = useModal();
      const { createMessage } = useMessage();
      const [registerTable, { reload }] = useTable({
        title: '字典列表',
        api: getDictTypeList,
        rowKey: 'id',
        columns,
        formConfig: {
          //查询区域设置
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
          colon: true,
        },
        scroll: { y: 'calc(100vh - 400px)' },
        useSearchForm: hasPermission('搜索类型'),
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
      //删除字典类型
      async function deleteType(record: Recordable) {
        const result = await DeleteDictType({ id: record.id });
        if (result.code != ResultEnum.SUCCESS) {
          createMessage.error(result.msg);
          return;
        }
        createMessage.success(result.msg);
        reload();
      }
      //添加字典值
      function openDict(record: Recordable) {
        valueModel(true, {
          record,
        });
      }
      //修改字典类型
      function update(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //添加类型
      function add() {
        openModal(true, {
          isUpdate: false,
        });
      }
      function handleSuccess() {
        reload();
      }

      return {
        openDict,
        hasPermission,
        update,
        add,
        registerDictValueModal,
        deleteType,
        registerTable,
        registerDictModal,
        handleSuccess,
      };
    },
  });
</script>
