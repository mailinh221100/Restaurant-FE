import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getDetailsAPI } from '@/pages/dashboard/service';

export default () => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>({});

  const getDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDetailsAPI();
      setDetails(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  return {
    loading,
    details,
    getDetails,
  };
};
