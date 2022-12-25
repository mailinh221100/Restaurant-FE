import { Tag, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const CategoryItem = ({ item, onDelete }: any) => {
  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    Modal.confirm({
      title: 'Delete a category',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to delete this category?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk() {
        (async () => {
          await onDelete(item._id);
        })();
      },
    });
  };

  return (
    <Tag closable onClose={confirm}>
      {item.categoryName}
    </Tag>
  );
};

export default CategoryItem;
