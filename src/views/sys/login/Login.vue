<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="layout_content flex">
      <div class="fl flex">
        <img src="@img/login_fl.png" alt="" />
      </div>
      <div class="fr">
        <div>
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import LoginForm from './LoginForm.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const { prefixCls } = useDesign('login');
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    overflow: hidden;

    &::before {
      content: '';
      position: fixed;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('@img/login-bg.png') no-repeat 0 -2px;
      background-size: 100% 100%;
    }

    .layout_content {
      align-items: center;
      width: 70vw;
      height: 82vh;
      overflow: hidden;
      border: 12px solid #92e1ff;
      border-radius: 24px;
      background: #fff;

      .fl {
        align-items: center;
        justify-content: center;
        width: 67%;
        height: 100%;
        background: #0f5cea;

        img {
          width: 85%;
          height: 75%;
          padding: 0 10px;
        }
      }

      .fr {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33%;

        > div {
          width: 82%;
        }
      }
    }
  }
</style>
