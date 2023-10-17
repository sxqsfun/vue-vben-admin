<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="synchronization" type="primary" v-if="hasPermission('同步')"
          >同步</a-button
        >
      </template>
    </BasicTable>
    <AddModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { FormProps } from '/@/components/Form';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import AddModal from '@/views/user/authority/add/AddModal.vue';
  import { getAuthorityList, sync } from './api';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const columns: BasicColumn[] = [
    {
      title: '页面URL',
      dataIndex: 'pageUrl',
    },
    {
      title: '按钮名称',
      dataIndex: 'buttonName',
      width: 150,
      //auth: 'test', // 根据权限控制是否显示: 无权限，不显示
    },
    {
      title: '接口名称',
      dataIndex: 'authorityName',
    },
    {
      title: '权限标识',
      dataIndex: 'authority',
    },
    {
      title: '同步时间',
      dataIndex: 'createTime',
    },
  ];

  const params: FormProps = {
    labelWidth: 120,
    schemas: [
      {
        field: 'keyword',
        label: '权限标识',
        labelWidth: 100,
        component: 'Input',
        colProps: { span: 6 },
      },
    ],
    autoSubmitOnEnter: true,
    colon: true,
  };

  export default defineComponent({
    components: { BasicTable, AddModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      //权限处理
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '权限列表',
        api: getAuthorityList,
        //dataSource:getBasicData(),
        columns: columns,
        bordered: true,
        rowKey: 'id',
        canResize: false,
        indexColumnProps: {
          fixed: 'left',
        },
        pagination: true,
        formConfig: params,
        scroll: { y: 'calc(100vh - 400px)' },
        useSearchForm: hasPermission('搜索'),
        showTableSetting: true,
        striped: true,
      });
      function synchronization() {
        const { createConfirm } = useMessage();
        const { t } = useI18n();
        createConfirm({
          iconType: 'warning',
          title: () => h('span', t('sys.app.logoutTip')),
          content: () => h('span', t('sys.app.syncMessage')),
          onOk: async () => {
            const result = await sync();
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              emit('success');
              handleSuccess();
            } else {
              createMessage.error(result.msg);
            }
          },
        });
      }
      function handleDelete(record: Recordable) {
        console.log('点击了删除', record);
      }
      function handleOpen(record: Recordable) {
        console.log('点击了启用', record);
      }
      function handleSuccess() {
        reload();
      }
      return {
        handleSuccess,
        registerTable,
        synchronization,
        registerModal,
        openModal,
        handleDelete,
        hasPermission,
        handleOpen,
      };
    },
  });
</script>
