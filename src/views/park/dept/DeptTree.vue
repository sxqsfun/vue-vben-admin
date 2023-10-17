<template>
  <div class="ml-2 overflow-hidden bg-white">
    <BasicTree
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      searchPlaceHolder="输入名称、编号进行搜索"
      :fieldNames="{ key: 'id', title: 'nameAndCode' }"
      :treeData="treeData"
      :clickRowToExpand="false"
      :loading="treeLoading"
      :expandOnSearch="true"
      :highlight="true"
      @select="handleSelect"
    >
      <template #headerTitle></template>
    </BasicTree>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { getDeptTreeList } from './api';

  export default defineComponent({
    name: 'DeptTree',
    components: { BasicTree },
    emits: ['select'],
    setup(_, { emit }) {
      const treeLoading = ref(false);
      const treeData: any = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null');
        }
        return tree;
      }

      async function fetch() {
        try {
          treeLoading.value = true;
          treeData.value = (await getDeptTreeList()) as unknown as TreeItem[];
        } finally {
          treeLoading.value = false;
        }
      }

      async function reload() {
        try {
          treeLoading.value = true;
          treeData.value = (await getDeptTreeList()) as unknown as TreeItem[];
          getTree().setExpandedKeys(getTree().getExpandedKeys());
        } finally {
          treeLoading.value = false;
        }
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });

      return { treeLoading, handleSelect, treeData, reload };
    },
  });
</script>
