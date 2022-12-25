import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  createMenuItemAPI,
  createOrderAPI,
  getListMenuItemsAPI,
  getListOrderDetailsAPI,
  getListOrdersAPI,
  updateStatusItemAPI,
  updateStatusOrderAPI,
} from '@/pages/menu/service';
import { history } from 'umi';

export default () => {
  const [loading, setLoading] = useState(false);
  const [listMenuItems, setListMenuItems] = useState<any>([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [listOrders, setListOrders] = useState<any>([]);

  const [listOrderDetails, setListOrderDetails] = useState<any>([]);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const getListMenuItems = useCallback(async (itemName: string) => {
    try {
      setLoading(true);
      const data = await getListMenuItemsAPI(itemName);
      setListMenuItems(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createOrder = useCallback(async (values: any) => {
    try {
      setLoadingCreate(true);
      await createOrderAPI(values);
      setLoadingCreate(false);
      history.push('/order-history');
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const getListOrders = useCallback(async (values: any) => {
    try {
      setLoading(true);
      const data = await getListOrdersAPI(values);
      setListOrders(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const getListOrderDetails = useCallback(async (id: string) => {
    try {
      setLoadingOrderDetail(true);
      const data = await getListOrderDetailsAPI(id);
      setListOrderDetails(data);
      setLoadingOrderDetail(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const updateStatusOrder = useCallback(async (id: string, status: string) => {
    try {
      await updateStatusOrderAPI(id, status);
      await getListOrders({});
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createMenuItem = useCallback(async (data: any, file: any) => {
    try {
      setLoadingCreate(true);
      await createMenuItemAPI(data, file);
      setLoadingCreate(false);
      setCreateModalVisible(false);
      await getListMenuItems('');
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const updateStatusItem = useCallback(async (id: string, status: string) => {
    try {
      await updateStatusItemAPI(id, status);
      await getListMenuItems('');
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  return {
    loading,
    listMenuItems,
    getListMenuItems,
    createOrder,
    loadingCreate,
    getListOrders,
    listOrders,
    getListOrderDetails,
    loadingOrderDetail,
    listOrderDetails,
    updateStatusOrder,
    createMenuItem,
    createModalVisible,
    setCreateModalVisible,
    updateStatusItem,
  };
};
