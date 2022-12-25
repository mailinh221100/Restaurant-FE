import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getListUsersAPI, resetPasswordAPI } from '@/pages/manage-user/service';

export default () => {
  const [loading, setLoading] = useState(false);
  const [listUsers, setListUsers] = useState<any>([]);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const getListUsers = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const data = await getListUsersAPI(email);
      setListUsers(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const resetPassword = useCallback(async (id: string) => {
    try {
      setLoadingResetPassword(true);
      const data = await resetPasswordAPI(id);
      setNewPassword(data.password);
      setLoadingResetPassword(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  return {
    loading,
    listUsers,
    getListUsers,
    resetPasswordModalVisible,
    setResetPasswordModalVisible,
    loadingResetPassword,
    resetPassword,
    newPassword,
  };
};
