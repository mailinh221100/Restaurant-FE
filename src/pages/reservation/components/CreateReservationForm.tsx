import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, TreeSelect } from 'antd';
import moment from 'moment';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useModel } from 'umi';

const { TextArea } = Input;

const CreateReservationForm = ({ open, onCreate, onCancel, loading }: any) => {
  const [form] = Form.useForm();

  const { listZones, getListZoneAndAvailableTables } = useModel('table', (returnValue) => ({
    listZones: returnValue.listZones,
    getListZoneAndAvailableTables: returnValue.getListZoneAndAvailableTables,
  }));

  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  const getNumberSeat = (tableType: string) => {
    if (tableType == 'Small') {
      return 2;
    } else if (tableType == 'Medium') {
      return 4;
    } else {
      return 10;
    }
  };

  const diningTableData = listZones.map((zone: any) => {
    const children = zone.diningTables.map((table: any) => ({
      value: table._id,
      title: `${table.tableName}: ${table.chairCount} ( ${getNumberSeat(table.chairCount)} seats) ${
        table.tableType
      } table`,
    }));

    const parent = {
      value: zone._id,
      title: zone.zoneName,
      children,
      selectable: false,
    };
    return parent;
  });

  const getAllDiningTables = (zones: any) => {
    let tables: any = [];
    for (const zone of zones) {
      tables = tables.concat(zone.diningTables);
    }

    return tables;
  };

  const calculateTotalSeat = (tableIds: any) => {
    const allDiningTables = getAllDiningTables(listZones);
    let totalSeat = 0;

    console.log(allDiningTables);
    for (const tableId of tableIds) {
      const table = allDiningTables.find((item: any) => item?._id?.valueOf() == tableId);
      if (table.chairCount == 'Small') {
        totalSeat += 2;
      } else if (table.chairCount == 'Medium') {
        totalSeat += 4;
      } else {
        totalSeat += 10;
      }
    }
    console.log(totalSeat);
    return totalSeat;
  };

  const handleOnDateChange = async (value: any) => {
    if (value) {
      const startDate = value.startOf('day').utc(true).toISOString();
      const endDate = value.endOf('day').utc(true).toISOString();
      await getListZoneAndAvailableTables({
        startDate,
        endDate,
      });
    }
  };

  return (
    <Modal
      open={open}
      title="Reserve your dining table"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            console.log(values);
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ guestCount: 1 }}>
        <Row>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Reservation Date"
              rules={[{ required: true, message: 'Please input reservation date!' }]}
            >
              <DatePicker disabledDate={disabledDate} onChange={handleOnDateChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="guestCount"
              label="Number of Guest"
              rules={[{ required: true, message: 'Please input number of guests!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { pattern: /^0\d{9}$/, message: 'Please input correct phone number!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="diningTables"
              label="Choose Dining Tables"
              rules={[
                { required: true, message: 'Please choose dining tables!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('guestCount') <= calculateTotalSeat(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Not enough seat'));
                  },
                }),
              ]}
            >
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
                multiple
                treeData={diningTableData}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="note" label="Note">
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateReservationForm;
