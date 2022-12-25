import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  createReservationAPI,
  getListReservationsAPI,
  updateStatusReservationAPI,
} from '@/pages/reservation/service';

export default () => {
  const [loading, setLoading] = useState(false);
  const [listReservations, setListReservations] = useState<any>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const getListReservations = useCallback(async (query: any) => {
    try {
      setLoading(true);
      const data = await getListReservationsAPI(query);
      setListReservations(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createReservation = useCallback(async (values: any) => {
    try {
      setLoadingCreate(true);
      await createReservationAPI(values);
      setLoadingCreate(false);
      setCreateModalVisible(false);
      await getListReservations({});
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const updateStatusReservation = useCallback(async (id: string, status: string) => {
    try {
      await updateStatusReservationAPI(id, status);
      await getListReservations({});
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  return {
    loading,
    listReservations,
    getListReservations,
    loadingCreate,
    setCreateModalVisible,
    createModalVisible,
    createReservation,
    updateStatusReservation,
  };
};
