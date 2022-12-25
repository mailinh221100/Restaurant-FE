import { LockOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, signUp } from '@/services/ant-design-pro/api';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const SignUpMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content === 'success' ? 'Sign up successful!' : content}
    type={content === 'success' ? 'success' : 'error'}
    showIcon
  />
);

const Login: React.FC = () => {
  const [type, setType] = useState<string>('login');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [signUpStatus, setSignUpStatus] = useState<string>('');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    if (type === 'login') {
      try {
        const msg = await login(values);
        const { token } = msg;
        window.localStorage.setItem('token', token);
        const defaultLoginSuccessMessage = 'Login successful!';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
      } catch (error) {
        setLoginStatus('error');
        const defaultLoginFailureMessage = 'Login failed, please try again!';
        message.error(defaultLoginFailureMessage);
      }
    }

    if (type === 'sign_up') {
      try {
        await signUp(values);
        setSignUpStatus('success');
        const defaultLoginSuccessMessage = 'Sign up successful!';
        message.success(defaultLoginSuccessMessage);
      } catch (error: any) {
        const errorMessage = error?.data?.message || 'Sign up failed!';
        setSignUpStatus(errorMessage);
        const defaultLoginFailureMessage = 'Sign up failed, please try again!';
        message.error(defaultLoginFailureMessage);
      }
    }
  };

  const handleOnTabChange = (value: any) => {
    setType(value);
    setLoginStatus('');
    setSignUpStatus('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo_girl_chef.png" />}
          title="Linh's Restaurant"
          subTitle={'Your favourite food, delivered hot & fresh'}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: type === 'login' ? 'Login' : 'Sign up',
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={handleOnTabChange}>
            <Tabs.TabPane key="login" tab={'Login'} />
            <Tabs.TabPane key="sign_up" tab={'Sign up'} />
          </Tabs>

          {loginStatus === 'error' && <LoginMessage content={'Incorrect email or password'} />}
          {signUpStatus && <SignUpMessage content={signUpStatus} />}
          {type === 'login' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Email'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Password'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              />
            </>
          )}

          {type === 'sign_up' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Email'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                  {
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'Please input correct email address!',
                  },
                ]}
              />
              <ProFormText
                name="fullName"
                fieldProps={{
                  size: 'large',
                  prefix: <InfoCircleOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Full name'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your full name!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Password'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
