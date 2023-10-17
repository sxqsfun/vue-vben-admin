<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    width="1200px"
    :title="getTitle"
    :showOkBtn="false"
    cancelText="关闭"
  >
    <BasicForm @register="registerForm">
      <template #formFooter>
        <div
          style="height: 3px; background-color: rgb(235, 235, 235); border-radius: 2px; width: 100%"
        >
        </div>
        <div
          v-if="isDetails"
          style="margin-top: 20px; margin-left: 90px; display: flex; width: 100%; height: 130px"
        >
          <div style="text-align: center; width: 21.3%">
            <div style="display: inline-grid">
              <label>头像</label>
              <img
                v-if="imageUrl.urlH != ''"
                width="102"
                height="102"
                :src="baseUrl + imageUrl.urlH"
                alt="avatar"
              />
            </div>
          </div>
          <div style="text-align: center; width: 37.3%">
            <div style="display: inline-grid">
              <label>身份证正面照</label>
              <img
                v-if="imageUrl.urlIdentityZ != ''"
                width="162"
                height="102"
                :src="baseUrl + imageUrl.urlIdentityZ"
                alt="avatar"
              />
            </div>
          </div>
          <div style="text-align: center; width: 37.3%">
            <div style="display: inline-grid">
              <label>身份证反面照</label>
              <img
                v-if="imageUrl.urlIdentityF != ''"
                width="162"
                height="102"
                :src="baseUrl + imageUrl.urlIdentityF"
                alt="avatar"
              />
            </div>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useGlobSetting } from '/@/hooks/setting/index';
  import { FileInfo } from '../model';
  import { getDeptTree } from '../api';
  import { formEmployeeDetailsSchema } from './data';

  export default defineComponent({
    name: 'DetailModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_) {
      const isUpdate = ref(true);
      const isDetails = ref(true);
      const [registerForm, { resetFields, setFieldsValue, updateSchema }] = useForm({
        labelWidth: 145,
        baseColProps: { span: 24 },
        schemas: formEmployeeDetailsSchema,
        showActionButtonGroup: false,
        colon: true,
        searchShow: false,
      });

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        //这种方式存在BUG componentProps treeData为数组类型 更新时如果与之前不相同 则会进行合并而不是替代 已修改底层为替代模式
        const treeData = await getDeptTree(); //加载菜单树
        updateSchema({
          field: 'departmentId',
          componentProps: { treeData },
        });

        resetFields();
        imageUrl.urlH = '';
        imageUrl.urlIdentityF = '';
        imageUrl.urlIdentityZ = '';
        setFieldsValue({ departmentId: data.deptId });
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        isDetails.value = !!data?.isDetails;

        if (unref(isDetails)) {
          setFieldsValue({
            ...data.record,
          });

          //渲染年龄
          let birthdays = new Date(data.record.birthDate);
          // 当前系统日期
          let d = new Date();
          let age =
            d.getFullYear() -
            birthdays.getFullYear() -
            (d.getMonth() < birthdays.getMonth() ||
            (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate())
              ? 1
              : 0);
          setFieldsValue({ age: age });

          //渲染工龄
          let employmentDate = new Date(data.record.employmentDate);
          let workingYears =
            d.getFullYear() -
            employmentDate.getFullYear() -
            (d.getMonth() < employmentDate.getMonth() ||
            (d.getMonth() == employmentDate.getMonth() && d.getDate() < employmentDate.getDate())
              ? 1
              : 0);
          setFieldsValue({ workingYears: workingYears });

          //渲染劳动关系年限
          if (data.record.jobEndDate && data.record.jobStartDate) {
            let d1 = new Date(data.record.jobEndDate);
            let d2 = new Date(data.record.jobStartDate);
            let value =
              d1.getFullYear() -
              d2.getFullYear() -
              (d1.getMonth() < d2.getMonth() ||
              (d1.getMonth() == d2.getMonth() && d1.getDate() < d2.getDate())
                ? 1
                : 0);
            setFieldsValue({ contractTerm: value });
          }

          //渲染图片
          imageUrl.urlH = data.record.headerImg;
          imageUrl.urlIdentityF = data.record.frontSide;
          imageUrl.urlIdentityZ = data.record.backSide;

          setFieldsValue({ phone: data.record.phone });
          setFieldsValue({ employmentDate: data.record.employmentDate });
          setFieldsValue({ professionTitle: data.record.professionTitle });
          setFieldsValue({ birthDate: data.record.birthDate });
          setFieldsValue({ registerAddress: data.record.registerAddress });
          setFieldsValue({ currentAddress: data.record.currentAddress });
          setFieldsValue({ graduationInstitution: data.record.graduationInstitution });
          setFieldsValue({ majorsStudied: data.record.majorsStudied });
          setFieldsValue({ jobStartDate: data.record.jobStartDate });
          setFieldsValue({ jobEndDate: data.record.jobEndDate });

          //详情页下拉框转换渲染
          if (unref(isDetails)) {
            setFieldsValue({ gender: data.record.gender == 1 ? '男' : '女' });
            setFieldsValue({ isDetails: isDetails.value });
            setFieldsValue({ qualification: data.record.qualificationDesc });
            setFieldsValue({ isSalesmanDesc: data.record.isSalesmanDesc });
            setFieldsValue({ statusDesc: data.record.statusDesc });

            //在职状态
            if (data.record.jobStatus == 'zz') {
              data.record.jobStatus = '在职';
            } else if (data.record.jobStatus == 'lz') {
              data.record.jobStatus = '离职';
            } else {
              data.record.jobStatus = '退休';
            }
            setFieldsValue({ jobStatus: data.record.jobStatus });
            setFieldsValue({ level: data.record.levelDesc });
          }
        }
        registerForm;
      });

      const baseUrl = useGlobSetting().minioAddr;

      const getTitle = computed(() => '员工详情');

      const fileList = ref([]);
      //
      const loadingH = ref<boolean>(false);
      const loadingF = ref<boolean>(false);
      const loadingZ = ref<boolean>(false);

      const imageUrl = reactive({
        urlH: '', //头像地址
        urlIdentityF: '', //身份证反面地址
        urlIdentityZ: '', //身份证正面地址
      });

      function handleChangeH(info: FileInfo) {
        if (info.file.status === 'uploading') {
          loadingH.value = true;
          return;
        }
      }

      function handleChangeIdentityF(info: FileInfo) {
        if (info.file.status === 'uploading') {
          loadingF.value = true;
          return;
        }
      }

      function handleChangeIdentityZ(info: FileInfo) {
        if (info.file.status === 'uploading') {
          loadingZ.value = true;
          return;
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,

        handleChangeH,
        handleChangeIdentityF,
        handleChangeIdentityZ,
        baseUrl,
        formEmployeeDetailsSchema,
        fileList,
        loadingH,
        loadingF,
        loadingZ,
        imageUrl,
        isDetails,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  ::v-deep .idCard .ant-upload-select-picture-card {
    width: 204px;
    height: 104px;
  }

  ::v-deep .ant-input-affix-wrapper-borderless {
    max-width: 220px;
  }
  ::v-deep .ant-input-affix-wrapper-borderless input {
    width: 100%;
    overflow-wrap: break-word;
  }
</style>
