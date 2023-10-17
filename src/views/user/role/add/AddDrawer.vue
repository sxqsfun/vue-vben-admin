<template>
  <BasicDrawer  v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="1050px" @ok="handleSubmit" @close=" showTree = false">
    <PageWrapper>
      <div >
        <a-tabs :default-active-key="currentKey" v-model:activeKey="currentKey" @change="tabChange">
          <a-tab-pane v-for="item in dataAll" :key="item.value" :tab="item.name" />
        </a-tabs>
        <div class="pt-4 m-4 desc-wrap"  v-if="showTree">
          <BasicTree :treeData="treeData" :fieldNames="{ key: 'value', title: 'name' }" ref="treeRef" :checkable="true"
            @expand="onExpand" />
        </div>
      </div>
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, createVNode, nextTick, render, unref, watch } from 'vue';
import { BasicForm, ApiTreeSelect } from '/@/components/Form';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { PageWrapper } from '/@/components/Page';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
import { authTree, saveAuth } from '../api';
import { Tabs, Select } from 'ant-design-vue';
import { useUserStore } from '/@/store/modules/user';
import { ResultEnum } from '/@/enums/httpEnum';
import { isEmpty } from '/@/utils/is';
import { getDeptTreeList } from '../api';

interface TreeNode {
  name: string, value: string, checked: boolean, children: TreeNode[];
}
export default defineComponent({
  name: 'AddDrawer',
  components: {
    BasicTree,
    BasicDrawer,
    PageWrapper,
    Select,
    BasicForm,
    [Tabs.name]: Tabs,
    [Tabs.TabPane.name]: Tabs.TabPane,
  },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    let currentKey = ref("");
    let roleId = ref("");
    const checkedKeys = reactive<string[]>([]);
    const { createMessage } = useMessage();
    const getTitle = computed(() => '角色权限管理');
    const userInfo = useUserStore().getUserInfo;
    const treeRef = ref<Nullable<TreeActionType>>(null);
    let dataAll = reactive<(TreeNode[])>([]);
    let treeData = ref<(TreeNode[])>([]) as any;
    let deptData = ref([]) as any;
    let showTree = ref(false);
    const selectData = [
      { value: 1, label: '全部数据' },
      { value: 2, label: '本部门及以下数据' },
      { value: 3, label: '本部门数据' },
      { value: 4, label: '仅本人数据' },
      { value: 5, label: '自定义' },
    ]

    //追加select组件
    const initSelelt = () => {
      let el = document.getElementsByClassName('levelHeight');
      Array.prototype.forEach.call(el, function (item) {
        if (item.classList.contains('flagClass')) {
          let valClass = item.getAttribute('class');
          let classArr = valClass.split(" ");
          let onceArr = classArr.find(r => r.includes('value-'));
          let [, valKey] = onceArr.split('-');

          render(createVNode(
            'div',
            {
              style: {
                display: 'flex'
              }
            },
            addTreeDataVal(treeData, valKey),
          ), item)
        }
      });
    }

    //将select组件用h函数递归渲染
    const addTreeDataVal = (target, key, init = [] as any) => {
      unref(target).forEach(item => {
        if (item.flag && item.value == key) {
          //单选                
          init.push(
            createVNode(
              'div',
              {
                class: 'customSelect',
                style: {
                  marginRight: '10px'
                }
              },
              [
                createVNode(Select,
                  {
                    value: item.scope,
                    options: selectData,
                    placeholder: "请选择",
                    ["onUpdate:value"]: (e) => {
                      // item.departmentIds = [];
                      item.scope = e;
                    },
                    style: {
                      width: '170px'
                    }
                  },
                )
              ]
            )
          );
          if (item.scope == 5) {
            //多选
            init.push(
              createVNode(
                'div',
                {
                  class: 'customSelect',
                },
                [
                  createVNode(ApiTreeSelect,
                    {
                      // api: getDeptTreeList,
                      treeData: deptData,
                      resultField: 'data',
                      labelField: 'name',
                      keyField: 'id',
                      valueField: 'id',
                      showSearch: true,
                      treeNodeFilterProp: 'name',
                      treeDefaultExpandAll: true,
                      allowClear: true,
                      treeCheckable: true,
                      treeCheckStrictly: true,
                      maxTagCount: 1,
                      placeholder: '请选择',
                      showCheckedStrategy: "SHOW_ALL",
                      defaultValue: item.departmentIds,
                      getPopupContainer: () => document.body,
                      ["onUpdate:value"]: (e) => {
                        // console.log(treeData.value, "treeData")
                        item.departmentIds = e;
                      },
                      style: {
                        width: '300px'
                      }
                    },
                  )
                ]
              )
            );
          }
        }
        item.children && addTreeDataVal(item.children, key, init);
      });
      return init;
    }

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      showTree.value =  true;
      try {
        setDrawerProps({ confirmLoading: true });
        roleId.value = data?.roleId;
        //可以执行界面初始化操作
        deptData = await getDeptTreeList();
        let dataTree = await authTree({ roleId: data?.roleId });
        addClass(dataTree.data);

        dataAll.splice(0, dataAll.length);
        dataAll.push(...dataTree.data);
        dataAll.forEach((k, v) => {
          if (v == 0) {
            //设置单个模块的Tree
            treeData.value.splice(0, treeData.value.length);
            treeData.value.push(...k.children);
            currentKey.value = k.value;
            //设置选中状态
            checkedKeys.splice(0, checkedKeys.length);
            checkedKeys.push(...filterChecked(treeData.value));
          }
        });

        //设置展开和选中
          unref(treeRef)?.expandAll(true);
          unref(treeRef)?.setCheckedKeys(checkedKeys);
       
      } finally {
        setDrawerProps({ confirmLoading: false });
      }

      })


    watch(treeData, (val) => {
      nextTick(() => {
        initSelelt()
      })
    }, {
      deep: true
    })

    //添加水平排列样式
    const addClass = (d) => {
      d.forEach((item, index) => {
        item.class = "levelHeight";
        if (item.flag) {
          item.class = `flagClass levelHeight value-${item.value}`;
          let scope = 4;
          if (!isEmpty(item.scope)) {
            scope = item.scope;
          }
          let deptIds = [];
          if (item.departmentIds && !isEmpty(item.departmentIds)) {
            deptIds = item.departmentIds.split(',');
          }
          item['scope'] = scope;
          item['departmentIds'] = deptIds;
        }
        if (!item.children) {
          item.class = "levelHeight level";
        }
        if (item.children?.length > 0) {
          addClass(item.children);
        }
      });
    }

    //过滤选中的节点id
    const filterChecked: any = (res: any[] | undefined) => {
      if (res == undefined || res.length == 0) {
        return [];
      }
      let checkedKeys: string[] = [];
      res.forEach((item: any, index: any) => {
        if (item.checked && item.value.split(":").length > 1) {
          checkedKeys.push(item.value);
        }
        if (item.children?.length > 0) {
          checkedKeys.push(...filterChecked(item.children));
        }
      });
      return checkedKeys;
    }

    async function handleSubmit() {
      const keys = unref(treeRef)?.getCheckedKeys() as any;
      try {
        setDrawerProps({ confirmLoading: true });
        let checkedJson = <{ menuId: string; roleId: string; button: string; isChecked: boolean; menuButton: string[]; }[]>[];
        let buttonChecked = {};
        if (keys != null) {
          for (let i = 0; i < keys.length; i++) {
            let checked = <{ menuId: string; roleId: string; button: string; isChecked: boolean; menuButton: string[]; }>{};
            let split = keys[i].split(":");
            checked.menuId = split.length > 0 ? split[0] : null;
            checked.roleId = roleId.value;
            if (split.length > 1) {
              checked.button = split.length > 1 ? split[1] : null;
              buttonChecked[checked.menuId] = buttonChecked[checked.menuId] == undefined ? checked.button : buttonChecked[checked.menuId] + "," + checked.button;
              checkedJson.push(checked);
            }
          }
        }
        let result = <{ menuId: string; roleId: string; button: string; isChecked: boolean; menuButton: string[]; scope?: number, departmentIds?: string }[]>[];
        let obj = {};
        for (let i = 0; i < checkedJson.length; i++) {
          checkedJson[i].isChecked = true;
          if (!obj[checkedJson[i].menuId]) {
            checkedJson[i].menuButton = buttonChecked[checkedJson[i].menuId] == undefined ? null : buttonChecked[checkedJson[i].menuId];
            result.push(checkedJson[i]);
            obj[checkedJson[i].menuId] = true;
          }
        }
        for (let i = 0; i < result.length; i++) {
          var item = unref(treeRef)?.getSelectedNode(result[i].menuId) as TreeItem;
          var deptIds = item['departmentIds'].map(obj => { 
            if(typeof(obj)==='string'){
              return obj;
            }
            return obj.value;
          });
          result[i].scope = item['scope'];
          result[i].departmentIds = item.scope==5?deptIds.join():null;
        }
       
        let rest = await saveAuth(result, roleId.value, currentKey.value);
        if (rest.code != ResultEnum.SUCCESS) {
          createMessage.error(rest.msg);
          return;
        }
        createMessage.success(rest.msg);
        closeDrawer();
        const roleIds = userInfo.roles.map(k => k.id);
        if (roleIds.includes(roleId.value)) {
          window.location.reload();
        }
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    const tabChange = (activeKey: string) => {
      dataAll.forEach((k, v) => {
        if (activeKey == k.value) {
          treeData.value.splice(0, treeData.value.length);
          treeData.value.push(...k.children);
          //设置选中状态
          checkedKeys.splice(0, checkedKeys.length);
          checkedKeys.push(...filterChecked(treeData.value));
        }
      })
      //展开全部节点(非初次渲染也可生效)
      unref(treeRef)?.expandAll(true);
      unref(treeRef)?.setCheckedKeys(checkedKeys);
      nextTick(() => {
        initSelelt()
      })
    }

    function onExpand(a, b) {
      if (b.expanded) {
        setTimeout(()=>{
          initSelelt();
        },300)
      }
    }

    return {
      tabChange, showTree,treeData, registerDrawer, checkedKeys, treeRef, getTitle, dataAll, currentKey, handleSubmit, onExpand
    };
  }
});
</script>

<style lang="less">
//设置树横向排列
.level {
  display: inline-flex !important;
  width: 20%;
}

.ant-tree-list-holder-inner {
  display: block !important;
}

//设置行间距
.levelHeight {
  height: 50px;
}
</style>
