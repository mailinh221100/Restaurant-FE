import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  createCategoryAPI,
  getListCategoriesAPI,
  deleteCategoryAPI,
} from '@/pages/category/service';

export default () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const getListCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getListCategoriesAPI();
      setListCategories(data);
      setLoading(false);
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const createCategory = useCallback(async (values: any) => {
    try {
      setLoadingCreate(true);
      await createCategoryAPI(values);
      setLoadingCreate(false);
      setCreateModalVisible(false);
      await getListCategories();
    } catch (error) {
      message.error('Something went wrong!');
    }
  }, []);

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        const filter = listCategories.filter((item: any) => item._id !== id);
        setListCategories(filter);
        await deleteCategoryAPI(id);
      } catch (error) {
        message.error('Something went wrong!');
      }
    },
    [listCategories],
  );

  return {
    createModalVisible,
    setCreateModalVisible,
    getListCategories,
    listCategories,
    loading,
    loadingCreate,
    createCategory,
    deleteCategory,
  };
};
