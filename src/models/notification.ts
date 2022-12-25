import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getNotices } from '@/services/ant-design-pro/api';

export default () => {
  const [loading, setLoading] = useState(false);
  const [listNotifications, setListNotifications] = useState([]);

  const getListNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotices();
      setListNotifications(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  return {
    getListNotifications,
    listNotifications,
    loading,
  };
};
