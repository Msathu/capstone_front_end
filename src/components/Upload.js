import React, { useState } from 'react';
import { Upload, message, Modal, Input, Form, Space, Card, Typography, Image, Row, Col, Button, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getAccessToken } from "../services/Storage";
import axios from 'axios';
import moment from 'moment';
import { saveReciept } from '../services/saveRecieptApi';
import { categories } from '../constants/categories';

const { Dragger } = Upload;
const { Title } = Typography;
const { Option } = Select;

const UploadComponent = () => {
  const [fileList, setFileList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    shopName: '',
    category: 'Retail and Grocery',
    amountPaid: '',
    discount: '',
    invoice_reciept_date: '',
    tax: '',
    total: '',
    vendor_name: '',
    vendor_phone: '',
    vendor_url: '',
    lineItems: [],
    address: {
      ADDRESS: '',
      ADDRESS_BLOCK: '',
      CITY: '',
      STATE: '',
      STREET: '',
      VENDOR_ADDRESS: '',
      ZIP_CODE: ''
    },
    reciept_object_url: ''
  });

  const handleUpload = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = getAccessToken();
      const response = await axios.post(`${process.env.API_BASE_URL}/reciept/getRecieptSummary`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent: percentCompleted });
        },
      });

      onSuccess("OK", file);

      const {
        VENDOR_NAME, VENDOR_PHONE, TAX, TOTAL, AMOUNT_PAID, SHOP_NAME,
        DISCOUNT, INVOICE_RECEIPT_DATE, VENDOR_URL, url, address, lineItems
      } = response.data;

      const formattedDate = INVOICE_RECEIPT_DATE ? moment(INVOICE_RECEIPT_DATE, ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD']).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY');

      const transformedData = {
        shopName: SHOP_NAME || VENDOR_NAME,
        category:'Retail and Grocery',
        vendor_name: VENDOR_NAME,
        vendor_phone: VENDOR_PHONE,
        tax: TAX,
        total: TOTAL,
        amountPaid: AMOUNT_PAID,
        discount: DISCOUNT,
        invoice_reciept_date: formattedDate,
        vendor_url: VENDOR_URL,
        lineItems: lineItems || [],
        address: {
          ADDRESS: address.ADDRESS || '',
          ADDRESS_BLOCK: address.ADDRESS_BLOCK || '',
          CITY: address.CITY || '',
          STATE: address.STATE || '',
          STREET: address.STREET || '',
          VENDOR_ADDRESS: address.VENDOR_ADDRESS || '',
          ZIP_CODE: address.ZIP_CODE || ''
        },
        reciept_object_url: url || ''
      };
      message.success('File Uploaded Successfully');
      setModalData(transformedData);
      setModalVisible(true);
    } catch (error) {
      onError(error);
      message.error('File upload failed');
    }
  };

  const handleModalOk = async () => {
    try {
      const response = await saveReciept(modalData);
      setModalVisible(false);
      setFileList([]);
      message.success(response.data.message);
    } catch (err) {
      message.error(err.response.data.message);
    }
  };

  const handleModalCancel = () => {
    setModalData({
      shopName: '',
      category: 'Retail and Grocery',
      amountPaid: '',
      discount: '',
      invoice_reciept_date: '',
      tax: '',
      total: '',
      vendor_name: '',
      vendor_phone: '',
      vendor_url: '',
      lineItems: [],
      address: {
        ADDRESS: '',
        ADDRESS_BLOCK: '',
        CITY: '',
        STATE: '',
        STREET: '',
        VENDOR_ADDRESS: '',
        ZIP_CODE: ''
      },
      reciept_object_url: ''
    });
    setFileList([]);
    setModalVisible(false);
  };

  const handleAddressChange = (field, value) => {
    setModalData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [field]: value,
      },
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    setModalData((prevData) => {
      const newLineItems = [...prevData.lineItems];
      newLineItems[index] = { ...newLineItems[index], [field]: value };
      return {
        ...prevData,
        lineItems: newLineItems,
      };
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Receipt Upload and Management</Title>
      <Row justify="center">
        <Col span={12}>
          <Dragger
            customRequest={handleUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            multiple={false}
            onRemove={(file) => {
              setFileList(fileList.filter((f) => f.uid !== file.uid));
            }}
            style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single file upload.</p>
          </Dragger>
        </Col>
      </Row>

      <Modal
        title="Edit Data"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Save
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          {modalData.reciept_object_url && (
            <Image
              width={200}
              src={modalData.reciept_object_url}
              alt='Uploaded Receipt'
              style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '20px', borderRadius: '8px' }}
            />
          )}
        </div>

        <Form layout="vertical">
          <Form.Item label="Shop Name">
            <Input value={modalData.shopName} required={true} onChange={(e) => setModalData({ ...modalData, shopName: e.target.value })} />
          </Form.Item>
          <Form.Item label="Category">
            <Select value={modalData.category} defaultValue={categories[4]} onChange={(value) => setModalData({ ...modalData, category: value })}>
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Vendor Name">
            <Input value={modalData.vendor_name} onChange={(e) => setModalData({ ...modalData, vendor_name: e.target.value })} />
          </Form.Item>
          <Form.Item label="Vendor Phone">
            <Input value={modalData.vendor_phone} onChange={(e) => setModalData({ ...modalData, vendor_phone: e.target.value })} />
          </Form.Item>
          <Form.Item label="Vendor Url">
            <Input value={modalData.vendor_url} onChange={(e) => setModalData({ ...modalData, vendor_url: e.target.value })} />
          </Form.Item>
          <Form.Item label="Invoice Receipt Date (DD/MM/YYYY)">
            <Input value={modalData.invoice_reciept_date} onChange={(e) => setModalData({ ...modalData, invoice_reciept_date: e.target.value })} />
          </Form.Item>
          <Form.Item label="Tax">
            <Input value={modalData.tax} onChange={(e) => setModalData({ ...modalData, tax: e.target.value })} />
          </Form.Item>
          <Form.Item label="Total">
            <Input value={modalData.total} onChange={(e) => setModalData({ ...modalData, total: e.target.value })} />
          </Form.Item>
          <Form.Item label="Amount Paid">
            <Input value={modalData.amountPaid} onChange={(e) => setModalData({ ...modalData, amountPaid: e.target.value })} />
          </Form.Item>
          <Form.Item label="Discount">
            <Input value={modalData.discount} onChange={(e) => setModalData({ ...modalData, discount: e.target.value })} />
          </Form.Item>

          <Title level={4} style={{ marginTop: '20px', marginBottom: '10px' }}>Address</Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Input placeholder="Address" value={modalData.address.ADDRESS} onChange={(e) => handleAddressChange('ADDRESS', e.target.value)} />
            <Input placeholder="Address Block" value={modalData.address.ADDRESS_BLOCK} onChange={(e) => handleAddressChange('ADDRESS_BLOCK', e.target.value)} />
            <Input placeholder="City" value={modalData.address.CITY} onChange={(e) => handleAddressChange('CITY', e.target.value)} />
            <Input placeholder="State" value={modalData.address.STATE} onChange={(e) => handleAddressChange('STATE', e.target.value)} />
            <Input placeholder="Street" value={modalData.address.STREET} onChange={(e) => handleAddressChange('STREET', e.target.value)} />
            <Input placeholder="Vendor Address" value={modalData.address.VENDOR_ADDRESS} onChange={(e) => handleAddressChange('VENDOR_ADDRESS', e.target.value)} />
            <Input placeholder="ZIP Code" value={modalData.address.ZIP_CODE} onChange={(e) => handleAddressChange('ZIP_CODE', e.target.value)} />
          </Space>

          <Title level={4} style={{ marginTop: '20px', marginBottom: '10px' }}>Line Items</Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {modalData.lineItems.map((item, index) => (
              <Card key={index} title={`Line Item ${index + 1}`} style={{ marginBottom: '16px' }}>
                <Form.Item label="Item">
                  <Input placeholder="Item" value={item.ITEM} onChange={(e) => handleLineItemChange(index, 'ITEM', e.target.value)} />
                </Form.Item>
                <Form.Item label="Price">
                  <Input placeholder="Price" value={item.PRICE} onChange={(e) => handleLineItemChange(index, 'PRICE', e.target.value)} />
                </Form.Item>
                <Form.Item label="Quantity">
                  <Input placeholder="Quantity" value={item.QUANTITY} onChange={(e) => handleLineItemChange(index, 'QUANTITY', e.target.value)} />
                </Form.Item>
                <Form.Item label="Unit Price">
                  <Input placeholder="Unit Price" value={item.UNIT_PRICE} onChange={(e) => handleLineItemChange(index, 'UNIT_PRICE', e.target.value)} />
                </Form.Item>
                <Form.Item label="Expense Row">
                  <Input placeholder="Expense Row" value={item.EXPENSE_ROW} onChange={(e) => handleLineItemChange(index, 'EXPENSE_ROW', e.target.value)} />
                </Form.Item>
              </Card>
            ))}
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default UploadComponent;
