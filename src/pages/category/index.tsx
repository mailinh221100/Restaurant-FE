import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateCategoryForm from '@/pages/category/components/CreateCategoryForm';
import CategoryItem from '@/pages/category/components/CategoryItem';

const Category = () => {
  const {
    getListCategories,
    listCategories,
    createModalVisible,
    setCreateModalVisible,
    loading,
    createCategory,
    loadingCreate,
    deleteCategory,
  } = useModel('category', (returnValue) => ({
    getListCategories: returnValue.getListCategories,
    listCategories: returnValue.listCategories,
    createModalVisible: returnValue.createModalVisible,
    setCreateModalVisible: returnValue.setCreateModalVisible,
    loading: returnValue.loading,
    createCategory: returnValue.createCategory,
    loadingCreate: returnValue.loadingCreate,
    deleteCategory: returnValue.deleteCategory,
  }));

  useEffect(() => {
    (async () => {
      await getListCategories();
    })();
  }, []);

  const content = (
    <>
      <p>Categorize food and drink...</p>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
        Add a category
      </Button>
    </>
  );

  const submitCreateForm = async (values: any) => {
    await createCategory(values);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
  };

  return (
    <PageContainer content={content}>
      <Card bordered={false} loading={loading}>
        {listCategories.map((item: any) => (
          <CategoryItem item={item} onDelete={handleDelete} />
        ))}

        <CreateCategoryForm
          open={createModalVisible}
          onCreate={(values: any) => submitCreateForm(values)}
          onCancel={() => setCreateModalVisible(false)}
          loading={loadingCreate}
        />
      </Card>
    </PageContainer>
  );
};

export default Category;
