<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    width="1200px"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #formFooter>
        <div
          style="height: 3px; background-color: rgb(235, 235, 235); border-radius: 2px; width: 100%"
        >
        </div>
        <div style="margin-top: 20px; margin-left: 90px; display: flex; width: 100%">
          <div style="text-align: center; width: 21.3%">
            <label>头像</label>
            <Upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              accept="image/*"
              :customRequest="uploadH"
              :beforeUpload="beforeUpload"
              :onChange="handleChangeH"
            >
              <img
                v-if="imageUrl.urlH != ''"
                width="102"
                height="102"
                :src="baseUrl + imageUrl.urlH"
                alt="avatar"
              />
              <div v-if="imageUrl.urlH == ''">
                <loading-outlined v-if="loadingH" />
                <plus-outlined v-else />
                <div class="ant-upload-text">头像上传</div>
              </div>
            </Upload>
          </div>
          <div style="text-align: center; width: 37.3%; margin-left: 30px" class="idCard">
            <label>身份证正面照</label>
            <Upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              accept="image/*"
              :customRequest="uploadIdentityZ"
              :beforeUpload="beforeUpload"
              :onChange="handleChangeIdentityZ"
            >
              <img
                v-if="imageUrl.urlIdentityZ != ''"
                width="162"
                height="102"
                :src="baseUrl + imageUrl.urlIdentityZ"
                alt="Reverse ID card photo"
              />
              <div v-if="imageUrl.urlIdentityZ == ''">
                <loading-outlined v-if="loadingZ" />
                <plus-outlined v-else />
                <div class="ant-upload-text">身份证正面上传</div>
              </div>
            </Upload>
          </div>
          <div style="text-align: center; width: 37.3%" class="idCard">
            <label>身份证反面照</label>
            <Upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              accept="image/*"
              :customRequest="uploadIdentityF"
              :beforeUpload="beforeUpload"
              :onChange="handleChangeIdentityF"
            >
              <img
                v-if="imageUrl.urlIdentityF != ''"
                width="162"
                height="102"
                :src="baseUrl + imageUrl.urlIdentityF"
                alt="Face photo of identity card"
              />
              <div v-if="imageUrl.urlIdentityF == ''">
                <loading-outlined v-if="loadingF" />
                <plus-outlined v-else />
                <div class="ant-upload-text">身份证反面上传</div>
              </div>
            </Upload>
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
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useGlobSetting } from '/@/hooks/setting/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { FileInfo, FileItem } from '../model';
  import {
    UploadHeadPFile,
    addEmployeeAddOrUpdate,
    updateEmployeeAddOrUpdate,
    getDeptTree,
  } from '../api';
  import { formEmployeeSchema } from './data';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { message, Upload } from 'ant-design-vue';

  export default defineComponent({
    name: 'AddEmployeeModal',
    components: { BasicModal, BasicForm, PlusOutlined, LoadingOutlined, Upload },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 145,
        baseColProps: { span: 24 },
        schemas: formEmployeeSchema,
        showActionButtonGroup: false,
        colon: true,
        searchShow: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
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

        if (unref(isUpdate)) {
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
          setFieldsValue({ gender: data.record.gender });
          setFieldsValue({ professionTitle: data.record.professionTitle });
          setFieldsValue({ birthDate: data.record.birthDate });
          setFieldsValue({ registerAddress: data.record.registerAddress });
          setFieldsValue({ currentAddress: data.record.currentAddress });
          setFieldsValue({ graduationInstitution: data.record.graduationInstitution });
          setFieldsValue({ majorsStudied: data.record.majorsStudied });
          setFieldsValue({ jobStartDate: data.record.jobStartDate });
          setFieldsValue({ jobEndDate: data.record.jobEndDate });
          if (data.record.level) {
            setFieldsValue({ level: data.record.level });
          }
        }
      });

      const baseUrl = useGlobSetting().minioAddr;

      const getTitle = computed(() => (!unref(isUpdate) ? '新增员工' : '编辑员工'));

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

      //头像上传方法
      async function uploadH(info) {
        const result = await UploadHeadPFile(info);
        imageUrl.urlH = result.data.url;
        loadingH.value = false;
      }
      //身份证反面上传方法
      async function uploadIdentityF(info) {
        const result = await UploadHeadPFile(info);
        imageUrl.urlIdentityF = result.data.url;
        loadingF.value = false;
      }
      //身份证正面上传方法
      async function uploadIdentityZ(info) {
        const result = await UploadHeadPFile(info);
        imageUrl.urlIdentityZ = result.data.url;
        loadingZ.value = false;
      }

      const beforeUpload = (file: FileItem) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      };

      async function handleSubmit() {
        try {
          const values = await validate();
          values.headerImg = imageUrl.urlH;
          values.frontSide = imageUrl.urlIdentityF;
          values.backSide = imageUrl.urlIdentityZ;
          console.log(values, 'value');
          setModalProps({ confirmLoading: true });

          if (isUpdate.value) {
            const result = await updateEmployeeAddOrUpdate(values); //修改员工
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              closeModal();
              emit('success');
            } else {
              createMessage.error(result.msg);
            }
          } else {
            const result = await addEmployeeAddOrUpdate(values); //添加员工
            if (result.code == ResultEnum.SUCCESS) {
              createMessage.success(result.msg);
              closeModal();
              emit('success');
            } else {
              createMessage.error(result.msg);
            }
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        uploadH,
        uploadIdentityF,
        uploadIdentityZ,
        baseUrl,
        handleSubmit,
        handleChangeH,
        beforeUpload,
        handleChangeIdentityF,
        handleChangeIdentityZ,
        fileList,
        loadingH,
        loadingF,
        loadingZ,
        imageUrl,
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
</style>
