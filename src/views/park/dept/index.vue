<template>
  <div ref="wrapEl">
    <PageWrapper contentClass="flex">
      <div class="flex justify-start">
        <a-button
          type="primary"
          class="mr-2"
          @click="handleAddDept"
          v-if="hasPermission('添加部门')"
        >
          添加部门
        </a-button>
      </div>
    </PageWrapper>
    <PageWrapper
      v-loading="loadingRef"
      v-l
      dense
      contentFullHeight
      fixedHeight
      contentClass="flex customPanelClass"
    >
      <DeptTree ref="WTreeRef" class="w-1/4 xl:w-1/5" @select="handleSelect" />
      <div class="panel_fr ml-4">
        <div style="height: 120px" v-if="deptTableIsShow">
          <BasicTable @register="registerDeptTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction
                  :actions="[
                    {
                      icon: 'clarity:note-edit-line',
                      onClick: handleEdit.bind(null, record),
                      label: '修改',
                      tooltip: '修改部门',
                      auth: '修改部门',
                    },
                    {
                      icon: 'ant-design:delete-outlined',
                      color: 'error',
                      label: '删除',
                      tooltip: '删除部门',
                      auth: '删除部门',
                      popConfirm: {
                        title: '是否确认删除',
                        placement: 'left',
                        confirm: handleDelete.bind(null, record),
                      },
                      ifShow: record.isEmployee && record.isSublevelDept,
                    },
                  ]"
                />
              </template>
            </template>
          </BasicTable>
        </div>
        <div
          style="width: 1278px; margin-left: 5px; padding-left: 5px; padding-right: 15px"
          v-if="deptTableIsShow"
        >
          <BasicTable @register="registerEmployeeTable">
            <template #toolbar>
              <a-button @click="saveEmployee" type="primary" v-if="hasPermission('添加员工')"
                >新增</a-button
              >
              <ImpExcel @success="loadDataSuccess" :isReturnFile="true" dateFormat="YYYY-MM-DD">
                <a-button type="primary" class="m-3" v-if="hasPermission('导入员工')">
                  导入
                </a-button>
              </ImpExcel>
              <a-button type="primary" @click="exportEmployeeData" v-if="hasPermission('导出员工')"
                >导出</a-button
              >
              <a-button type="link" @click="templateDownload" v-if="hasPermission('模板下载')"
                >模板下载</a-button
              >
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'headerImg'">
                <TableImg
                  :size="40"
                  :srcPrefix="minioAddr"
                  :simpleShow="true"
                  :imgList="getImage(record.headerImg)"
                />
              </template>
              <template v-if="column.key === 'frontSide'">
                <TableImg
                  :size="40"
                  :srcPrefix="minioAddr"
                  :simpleShow="true"
                  :imgList="getImage(record.frontSide)"
                />
              </template>
              <template v-if="column.key === 'backSide'">
                <TableImg
                  :size="40"
                  :srcPrefix="minioAddr"
                  :simpleShow="true"
                  :imgList="getImage(record.backSide)"
                />
              </template>
              <template v-if="column.key === 'action'">
                <TableAction
                  :actions="[
                    {
                      icon: 'clarity:info-standard-line',
                      onClick: detailsEmpoloyee.bind(null, record),
                      label: '详情',
                      tooltip: '员工详情',
                      //auth: '修改员工',
                    },
                    {
                      icon: 'clarity:note-edit-line',
                      onClick: editEmpoloyee.bind(null, record),
                      label: '修改',
                      tooltip: '修改员工',
                      auth: '修改员工',
                      ifShow: record.jobStatus != 'lz',
                    },
                  ]"
                />
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
    </PageWrapper>
    <AddModal @register="registerAddModal" @success="handleSuccess" />
    <AddEmployeeModal @register="registerEmployeeAddOrUpdateModal" @success="handleSuccess" />
    <DetailModal @register="registerDetailModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import AddModal from './add/AddModal.vue';
  import DetailModal from './employee/DetailModal.vue';
  import {
    delDept,
    getDeptUserListTable,
    getEmployeeListPage,
    template,
    importExcel,
    exportData,
  } from './api';
  import DeptTree from './DeptTree.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { ImpExcel } from '/@/components/Excel';
  import { useLoading } from '/@/components/Loading';
  import { SizeEnum } from '/@/enums/sizeEnum';
  import {departmentHeadColumns} from "@/views/park/dept/data";

  export default defineComponent({
    name: 'DeptManagement',
    components: {
      PageWrapper,
      DeptTree,
      BasicTable,
      TableAction,
      DetailModal,
      ImpExcel,
      AddModal,
      TableImg,
    },
    setup() {
      const deptId = ref('');

      const formValue = reactive({ formValueData: { ids: '', deptId: '' } });
      const wrapEl = ref<ElRef>();
      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEl,
        props: {
          tip: '导入中...',
          absolute: true,
          size: SizeEnum.DEFAULT,
        },
      });
      //权限处理
      const { hasPermission } = usePermission();
      //图片前缀
      const { minioAddr } = useGlobSetting();
      const { createMessage } = useMessage();
      const [registerAddModal, { openModal: openDeptModal }] = useModal();
      const [registerEmployeeAddOrUpdateModal, { openModal: openEmployeeModal }] = useModal();
      const [registerDetailModal, { openModal: openEmployeeDetailsModal }] = useModal();
      const [registerDeptTable, { reload: deptReload }] = useTable({
        api: getDeptUserListTable,
        rowKey: 'id',
        showIndexColumn: false,
        columns: departmentHeadColumns,
        bordered: true,
        canResize: true,
        beforeFetch: () => {
          return { deptId: deptId.value };
        },
        pagination: false,
        actionColumn: {
          width: 250,
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          // slots: { customRender: 'action' },
        },
      });
      //部门人员列表
      const [
        registerEmployeeTable,
        { reload: reloadEmployee, getSelectRowKeys, getForm, clearSelectedRowKeys },
      ] = useTable({
        api: getEmployeeListPage,
        bordered: true,
        rowKey: 'id',
        canResize: false,
        scroll: { y: 'calc(100vh - 680px)' },
        clearSelectOnPageChange: true,
        rowSelection: { type: 'checkbox' },
        clickToRowSelect: false,
        showIndexColumn: true,
        beforeFetch: (params) => {
          params.deptId = deptId.value;
          return params;
        },
        //初始化第一次，调用表单默认的值作为条件
        handleSearchInfoFn: (params) => {
          return params;
        },
        formConfig: {
          labelWidth: 90,
          schemas: searchSchema,
          autoSubmitOnEnter: true,
          colon: true,
          submitButtonOptions: {
            onClick: () => {
              clearSelectedRowKeys();
              formValue.formValueData = getForm().getFieldsValue() as any;
            },
          },
          fieldMapToTime: [
            ['createTime', ['startCreateTime', 'endCreateTime'], 'YYYY-MM-DD HH:mm:ss'],
            ['employmentDate', ['startEmploymentDate', 'endEmploymentDate'], 'YYYY-MM-DD HH:mm:ss'],
          ],
        },
        indexColumnProps: {
          fixed: 'left',
        },
        pagination: true,
        columns: employeeColumns,
        useSearchForm: true,
        showTableSetting: true,
        striped: true,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
        },
      });
      const WTreeRef = ref<any>();
      const deptTableIsShow = ref(false);
      const loadingRef = ref(false);

      /**
       * 处理树节点选择事件
       * @param key
       */
      async function handleSelect(key) {
        //清空表格勾选
        if (deptId.value) {
          clearSelectedRowKeys();
        }
        deptTableIsShow.value = true;
        if (key) {
          deptId.value = key;
          setTimeout(() => {
            deptReload();
            reloadEmployee();
          }, 50);
        }
      }

      function saveEmployee() {
        openEmployeeModal(true, {
          deptId: deptId.value,
          isUpdate: false,
        });
      }
      function handleEdit(record: Recordable) {
        openDeptModal(true, {
          record,
          isUpdate: true,
        });
      }
      //编辑员工
      function editEmpoloyee(record: Recordable) {
        openEmployeeModal(true, {
          record,
          deptId: deptId.value,
          isUpdate: true,
        });
      }
      //员工详情
      function detailsEmpoloyee(record: Recordable) {
        openEmployeeDetailsModal(true, {
          record,
          deptId: deptId.value,
          isDetails: true,
        });
      }
      function handleAddDept() {
        openDeptModal(true, {
          isUpdate: false,
        });
      }

      function getImage(img) {
        if (img) {
          return [img];
        }
        return [];
      }

      async function handleDelete(record: Recordable) {
        const resp = await delDept(record.id);
        if (resp.code == 200) {
          createMessage.success(resp.msg);
          deptId.value = '';
          WTreeRef.value.reload(); //刷新树数据
          deptReload();
        } else {
          createMessage.error(resp.msg);
        }
      }

      /**
       * 处理成功回调
       */
      function handleSuccess() {
        WTreeRef.value.reload(); //刷新树数据
        if (deptId.value != '') {
          deptReload();
          reloadEmployee();
        }
      }

      /**
       * 模板下载
       */
      async function templateDownload() {
        await template();
      }

      //导入员工数据（excel文件）
      async function loadDataSuccess(rawFile) {
        openWrapLoading();
        const result = await importExcel(rawFile);
        if (result.code == ResultEnum.SUCCESS) {
          createMessage.success(result.msg);
          handleSuccess();
        } else {
          createMessage.error(result.msg);
        }
        closeWrapLoading();
      }

      async function exportEmployeeData() {
        const keys = getSelectRowKeys();
        formValue.formValueData.ids = keys.toString();
        formValue.formValueData.deptId = deptId.value;
        await exportData(formValue.formValueData);
      }

      return {
        handleSelect,
        handleAddDept,
        registerAddModal,
        handleEdit,
        openDeptModal,
        handleDelete,
        handleSuccess,
        WTreeRef,
        loadingRef,
        deptTableIsShow,
        registerDeptTable,
        registerEmployeeTable,
        saveEmployee,
        registerEmployeeAddOrUpdateModal,
        minioAddr,
        getImage,
        templateDownload,
        editEmpoloyee,
        detailsEmpoloyee,
        hasPermission,
        registerDetailModal,
        loadDataSuccess,
        exportEmployeeData,
        wrapEl,
      };
    },
  });
</script>

<style scoped lang="less">
  .customPanelClass {
    padding-bottom: 14px;

    .panel_fr {
      flex: 1;
      background: #fff;
      padding: 10px 20px;
    }
  }
</style>

<style scoped>
  ::v-deep .ant-table-cell-with-append button {
    display: none;
  }
</style>
