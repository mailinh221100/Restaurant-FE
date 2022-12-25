// @ts-ignore
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import ResetPasswordForm from '@/pages/manage-user/components/ResetPasswordForm';

const ManageUser = () => {
  const actionRef = useRef<ActionType>();
  const {
    loading,
    listUsers,
    getListUsers,
    resetPasswordModalVisible,
    setResetPasswordModalVisible,
    loadingResetPassword,
    resetPassword,
    newPassword,
  } = useModel('manageUser', (returnValue) => ({
    loading: returnValue.loading,
    listUsers: returnValue.listUsers,
    getListUsers: returnValue.getListUsers,
    resetPasswordModalVisible: returnValue.resetPasswordModalVisible,
    setResetPasswordModalVisible: returnValue.setResetPasswordModalVisible,
    loadingResetPassword: returnValue.loadingResetPassword,
    resetPassword: returnValue.resetPassword,
    newPassword: returnValue.newPassword,
  }));

  const [selectedUser, setSelectedUser] = useState<any>({});

  useEffect(() => {
    (async () => {
      await getListUsers('');
    })();
  }, []);

  const content = (
    <>
      <p>Manage your users...</p>
    </>
  );

  const columns: ProColumns<any>[] = [
    {
      title: 'User Full Name',
      dataIndex: 'fullName',
      search: false,
      valueType: 'text',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: 'Created Date',
      dataIndex: 'createAt',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      search: false,
      render: (_, record: any) => {
        if (record && record.roles && record.roles.includes('admin')) {
          return <Tag color="#f50">Admin</Tag>;
        }
        return <Tag color="#2db7f5">User</Tag>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <Button
          type="link"
          onClick={() => {
            setSelectedUser(record);
            setResetPasswordModalVisible(true);
          }}
        >
          Reset password
        </Button>,
      ],
    },
  ];

  const submitCreateForm = async () => {
    await resetPassword(selectedUser._id);
  };

  const handleSubmitSearch = async (values: any) => {
    const query = values.email || '';

    await getListUsers(query);
  };

  return (
    <PageContainer content={content}>
      <ProTable<any, any>
        headerTitle="Users"
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
        dataSource={listUsers || []}
        columns={columns}
        onSubmit={handleSubmitSearch}
      />
      <ResetPasswordForm
        open={resetPasswordModalVisible}
        onCreate={() => submitCreateForm()}
        onCancel={() => setResetPasswordModalVisible(false)}
        loading={loadingResetPassword}
        user={selectedUser}
        newPassword={newPassword}
      />
    </PageContainer>
  );
};

export default ManageUser;
