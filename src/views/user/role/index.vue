<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="addRole" v-if="hasPermission('添加')">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '修改',
                icon: 'clarity:note-edit-line',
                onClick: updateRole.bind(null, record),
                auth: '修改',
              },
              {
                label: '删除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否删除',
                  confirm: handleDelete.bind(null, record, column),
                },
                auth: '删除',
              },
              {
                label: '权限',
                icon: 'dashicons:align-center',
                onClick: handleAuthenticate.bind(null, record),
                auth: '权限',
              },
            ]"
            :dropDownActions="[]"
          />
        </template>
      </template>
    </BasicTable>
    <AddModal @register="registerModal" @success="handleSuccess" />
    <AddDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import AddModal from './add/AddModal.vue';
  import AddDrawer from './add/AddDrawer.vue';
  import { columns, searchFormSchema } from './data';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useDrawer } from '/@/components/Drawer';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { delRole, getRoleList } from './api';

  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, AddModal, AddDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: getRoleList,
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
        useSearchForm: hasPermission('搜索'),
        showIndexColumn: true,
        striped: true,
        showTableSetting: true,
        bordered: true,
        canResize: false,
        ellipsis: true,
        actionColumn: {
          width: 250,
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
        },
      });
      function handleAuthenticate(record: Recordable) {
        openDrawer(
          true,
          {
            record,
            isUpdate: true,
            roleId: record.id,
          },
          true,
        );
      }
      //是否删除角色
      async function handleDelete(record: Recordable) {
        //接口
        const result = await delRole({ id: record.id });
        if (result.code != ResultEnum.SUCCESS) {
          createMessage.error(result.msg);
          return;
        }
        createMessage.success(result.msg);
        reload();
      }
      //添加角色
      function addRole() {
        openModal(true, {
          isUpdate: false,
        });
      }
      //修改角色
      function updateRole(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      function handleSuccess() {
        reload();
      }

      return {
        addRole,
        hasPermission,
        updateRole,
        handleDelete,
        registerTable,
        registerModal,
        registerDrawer,
        handleAuthenticate,
        handleSuccess,
      };
    },
  });
</script>
