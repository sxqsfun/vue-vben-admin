<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="nomal" @click="handleExpandAll"> 展开/折叠 </a-button>
        <a-button type="primary" v-if="hasPermission('添加')" @click="handleCreate"> 新增 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'ant-design:plus-square-outlined',
              onClick: handleCreateByParent.bind(null, record),
              label: '新增',
              tooltip: '新增菜单',
              auth: '添加',
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              label: '修改',
              tooltip: '修改菜单',
              auth: '修改',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              tooltip: '删除菜单',
              auth: '删除',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
              ifShow: !record.hasChildren
            },
          ]" />
        </template>
      </template>
    </BasicTable>
    <AddDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { ResultEnum } from "/@/enums/httpEnum";
import { useMessage } from '/@/hooks/web/useMessage';
import { getMenuTreeList, delMenu } from './api';
import { useDrawer } from '/@/components/Drawer';
import AddDrawer from './add/AddDrawer.vue';
import { usePermission } from '/@/hooks/web/usePermission';
import { columns, searchFormSchema } from './data';

export default defineComponent({
  name: 'MenuManagement',
  components: { BasicTable, AddDrawer, TableAction },
  setup() {
    const [registerDrawer, { openDrawer }] = useDrawer();
    const { createMessage } = useMessage();
    const { hasPermission } = usePermission();
    var isExpandAll = true;
    const [registerTable, { reload, expandAll, collapseAll }] = useTable({
      title: '菜单列表',
      api: getMenuTreeList,
      rowKey: 'id',
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        colon: true,
      },
      scroll:{ y: 'calc(100vh - 400px)' },
      isTreeTable: true,
      useSearchForm: hasPermission('搜索'),
      pagination: false,
      showIndexColumn: true,
      indexColumnProps: {
        fixed: 'left',
      },
      striped: true,
      showTableSetting: true,
      bordered: true,
      canResize: false,
      actionColumn: {
        width: 250,
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        // slots: { customRender: 'action' },
      },
    });

    function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
      }, true);
    }

    function handleCreateByParent(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: false,
      }, true);
    }

    function handleEdit(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: true,
      }, true);
    }

    async function handleDelete(record: Recordable) {
      const result = await delMenu(record.id);
      if (result.code == ResultEnum.SUCCESS) {
        createMessage.success(result.msg);
        reload();
      } else {
        createMessage.error(result.msg);
      }
    }

    function handleSuccess() {
      reload();
    }

    function onFetchSuccess() {
      // nextTick(expandAll);//展开所有项
    }

    function handleExpandAll() {
      if (isExpandAll) {
        isExpandAll = false;
        nextTick(expandAll);//展开所有项
      } else {
        isExpandAll = true;
        nextTick(collapseAll);
      }
    }

    return {
      registerTable,
      registerDrawer,
      handleCreate,
      handleCreateByParent,
      handleEdit,
      handleDelete,
      handleSuccess,
      onFetchSuccess,
      hasPermission,
      handleExpandAll,
    };
  },
});
</script>
