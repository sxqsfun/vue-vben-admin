<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="addUser" v-if="hasPermission('添加')">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '修改',
                tooltip: '修改账户',
                icon: 'clarity:note-edit-line',
                onClick: update.bind(null, record),
                auth: '修改',
              },
              {
                label: '重置密码',
                tooltip: '重置密码',
                icon: 'dashicons:align-center',
                popConfirm: {
                  title: '是否重置密码',
                  confirm: resetPassword.bind(null, record),
                },
                auth: '重置密码',
              },
              {
                label: '绑定员工',
                tooltip: '绑定员工',
                icon: 'ant-design:fork-outlined',
                onClick: bindEmp.bind(null, record),
                auth: '绑定员工',
              },
            ]"
            :dropDownActions="[]"
          />
        </template>
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
    <BindEmpModal @register="registerBindEmpModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserList, ResetPassword } from './api';
  import UserModal from './add/AddModal.vue';
  import BindEmpModal from './add/BindEmpModal.vue';
  import { columns, searchFormSchema } from './data';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { ResultEnum } from '/@/enums/httpEnum';

  export default defineComponent({
    name: 'UserManagement',
    components: { BasicTable, TableAction, UserModal, BindEmpModal },
    setup() {
      const { hasPermission } = usePermission();
      const [registerModal, { openModal }] = useModal();
      const [registerBindEmpModal, { openModal: openBindEmpModal }] = useModal();
      const { createMessage } = useMessage();
      const [registerTable, { reload }] = useTable({
        title: '账户列表',
        api: getUserList,
        rowKey: 'id',
        columns,
        formConfig: {
          //查询区域设置
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
          fieldMapToTime: [
            // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
            [
              'createTime',
              ['startCreateTime', 'endCreateTime'],
              ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
            ],
          ],
          colon: true,
          baseColProps: { span: 6 },
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
          width: 300,
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
        },
      });

      //重置密码
      async function resetPassword(record: Recordable) {
        const result = await ResetPassword({ id: record.id });
        if (result.code != ResultEnum.SUCCESS) {
          createMessage.error(result.msg);
          return;
        }
        createMessage.success(result.msg);
        reload();
      }

      //绑定员工信息
      async function bindEmp(record: Recordable) {
        openBindEmpModal(true, {
          record,
        });
      }

      //添加用户信息
      function addUser() {
        openModal(true, {
          isUpdate: false,
        });
      }

      //修改用户信息
      function update(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      //处理成功回调
      function handleSuccess() {
        reload();
      }

      return {
        addUser,
        hasPermission,
        update,
        resetPassword,
        bindEmp,
        registerTable,
        registerModal,
        handleSuccess,
        registerBindEmpModal,
      };
    },
  });
</script>
