import { useState, useCallback } from 'react';
import { message } from 'antd';
import { queryCurrent, changePasswordAPI } from '@/pages/account/center/service';

export default () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await queryCurrent();
      setCurrentUser(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const changePassword = useCallback(async (values: any) => {
    try {
      setLoadingChangePassword(true);
      await changePasswordAPI(values);
      setLoadingChangePassword(false);
      message.success('Change password successful!');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Change password failed!';
      message.error(errorMessage);
      setLoadingChangePassword(false);
    }
  }, []);

  return {
    loading,
    currentUser,
    getCurrentUser,
    changePassword,
    loadingChangePassword,
  };
};
