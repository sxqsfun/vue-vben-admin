<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" v-if="hasPermission('添加')" @click="handleCreate">
          新增
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:pause-circle-outlined',
                label: '暂停',
                tooltip: '暂停任务',
                auth: '暂停',
                popConfirm: {
                  title: '是否确认暂停',
                  placement: 'left',
                  confirm: handlePause.bind(null, record),
                },
                ifShow: record.jobStatus == 'NORMAL',
              },
              {
                icon: 'ant-design:play-circle-outlined',
                label: '恢复',
                tooltip: '恢复任务',
                auth: '恢复',
                popConfirm: {
                  title: '是否确认恢复',
                  placement: 'left',
                  confirm: handleResume.bind(null, record),
                },
                ifShow: record.jobStatus == 'PAUSED',
              },
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '修改',
                tooltip: '修改任务',
                auth: '修改',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除',
                tooltip: '删除任务',
                auth: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AddModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getJobList, delJob, pauseJob, resumeJob } from './api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { ResultEnum } from '/@/enums/httpEnum';
  import AddModal from './add/AddModal.vue';
  import { columns, searchFormSchema } from './data';

  export default defineComponent({
    name: 'JobManagement',
    components: { BasicTable, AddModal, TableAction },
    setup() {
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '定时任务列表',
        api: getJobList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
          colon: true,
        },
        useSearchForm: hasPermission('搜索'),
        pagination: true,
        showIndexColumn: true,
        indexColumnProps: {
          fixed: 'left',
        },
        striped: true,
        showTableSetting: true,
        bordered: true,
        canResize: false,
        actionColumn: {
          width: 300,
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          // slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        const result = await delJob({ jobName: record.jobName, jobGroup: record.jobGroup });
        if (result.code == ResultEnum.SUCCESS) {
          createMessage.success(result.msg);
          reload();
        } else {
          createMessage.error(result.msg);
        }
      }

      async function handlePause(record: Recordable) {
        const result = await pauseJob({ jobName: record.jobName, jobGroup: record.jobGroup });
        if (result.code == ResultEnum.SUCCESS) {
          createMessage.success(result.msg);
          reload();
        } else {
          createMessage.error(result.msg);
        }
      }

      async function handleResume(record: Recordable) {
        const result = await resumeJob({ jobName: record.jobName, jobGroup: record.jobGroup });
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

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handlePause,
        handleResume,
        handleSuccess,
        hasPermission,
      };
    },
  });
</script>
