import { FormSchema } from '/@/components/Form';
import { VerifyPwd } from '/@/api/sys/user';
import { useUserStore } from '/@/store/modules/user';

export const formSchema: FormSchema[] = [
  {
    field: 'passwordOld',
    label: '原密码',
    component: 'InputPassword',
    required: true,
    dynamicRules: () => {
      return [
        {
          required: true,
          trigger: 'blur',
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('原密码不能为空');
            }
            const valid = await VerifyPwd({ id: useUserStore().getUserInfo.userId, pwd: value });
            if (valid.code != 200) {
              return Promise.reject('原密码错误');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    field: 'passwordNew',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',

    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('密码不能为空');
            }
            if (value !== values.passwordNew) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
