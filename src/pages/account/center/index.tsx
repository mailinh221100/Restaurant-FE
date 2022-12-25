import { useModel } from 'umi';
import { GoogleOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Tag, Typography, Form, Input, Button } from 'antd';
import React, { useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import type { RouteChildrenProps } from 'react-router';
import type { CurrentUser } from './data.d';
import styles from './Center.less';

const { Title } = Typography;

const Center: React.FC<RouteChildrenProps> = () => {
  const [form] = Form.useForm();
  const { loading, currentUser, getCurrentUser, changePassword, loadingChangePassword } = useModel(
    'account',
    (returnValue) => ({
      loading: returnValue.loading,
      currentUser: returnValue.currentUser,
      getCurrentUser: returnValue.getCurrentUser,
      changePassword: returnValue.changePassword,
      loadingChangePassword: returnValue.loadingChangePassword,
    }),
  );

  useEffect(() => {
    (async () => {
      await getCurrentUser();
    })();
  }, []);

  const renderUserInfo = ({ email, roles }: Partial<CurrentUser>) => {
    return (
      <div className={styles.detail}>
        <p>
          <GoogleOutlined
            style={{
              marginRight: 8,
            }}
          />
          Email: {email}
        </p>
        <p>
          <UserOutlined
            style={{
              marginRight: 8,
            }}
          />
          Role:{' '}
          {roles && roles.includes('admin') ? (
            <Tag color="#f50">Admin</Tag>
          ) : (
            <Tag color="#2db7f5">User</Tag>
          )}
        </p>
      </div>
    );
  };

  const onFinish = async (values: any) => {
    await changePassword(values);
    form.resetFields();
  };

  return (
    <GridContent>
      <Row gutter={24} justify="center">
        <Col lg={8} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={loading}>
            {!loading && currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img
                    alt=""
                    src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                  />
                  <div className={styles.name}>{currentUser.fullName}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <Title level={5}>Change password</Title>
                <Form
                  form={form}
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Please input your old password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label="New Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={loadingChangePassword}>
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};
export default Center;
