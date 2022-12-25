import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  createZoneAPI,
  deleteZoneAPI,
  getListZoneAndAvailableTablesAPI,
  getListZonesAPI,
  getZoneByIdAPI,
} from '@/pages/table/list/service';
import { createTableAPI, deleteTableAPI } from '@/pages/table/detail/service';

export default () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listZones, setListZones] = useState<any>([]);
  const [zone, setZone] = useState<any>({});

  const getListZones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getListZonesAPI();
      setListZones(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const getListZoneAndAvailableTables = useCallback(async (date: any) => {
    try {
      setLoading(true);
      const data = await getListZoneAndAvailableTablesAPI(date);
      setListZones(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createZone = useCallback(async (values: any) => {
    try {
      setLoadingCreate(true);
      await createZoneAPI(values);
      setLoadingCreate(false);
      setCreateModalVisible(false);
      await getListZones();
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const deleteZone = useCallback(async (id: string) => {
    try {
      await deleteZoneAPI(id);
      await getListZones();
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const getZoneById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await getZoneByIdAPI(id);
      setZone(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createTable = useCallback(async (values: any) => {
    try {
      setLoadingCreate(true);
      await createTableAPI(values);
      setLoadingCreate(false);
      setCreateModalVisible(false);
      await getZoneById(values.zone);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const deleteTable = useCallback(async (id: string, zoneId: string) => {
    try {
      await deleteTableAPI(id);
      await getZoneById(zoneId);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  return {
    loading,
    listZones,
    getListZones,
    createModalVisible,
    setCreateModalVisible,
    createZone,
    loadingCreate,
    deleteZone,
    getZoneById,
    zone,
    createTable,
    deleteTable,
    getListZoneAndAvailableTables,
  };
};
