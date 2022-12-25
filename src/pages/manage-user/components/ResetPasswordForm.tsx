import { Typography, Modal, Space } from 'antd';

const { Text } = Typography;

const ResetPasswordForm = ({ open, onCreate, onCancel, loading, user, newPassword }: any) => {
  return (
    <Modal
      open={open}
      title="Reset password"
      okText="Reset"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        onCreate();
      }}
      confirmLoading={loading}
    >
      <Space direction="vertical">
        <Text>Do you want to reset password of this user?</Text>
        <Text strong>Email: {user.email}</Text>
        <Text strong>Full name: {user.fullName}</Text>
        <Text>New password is: {newPassword}</Text>
      </Space>
    </Modal>
  );
};

export default ResetPasswordForm;
