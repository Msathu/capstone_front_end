import React, { useEffect, useState } from 'react';
import { getReciepts } from '../services/getRecieptsApi';
import { List, message, Pagination, Image, Input, DatePicker, Button, Modal, Form, InputNumber, Popconfirm, Select } from 'antd';
import '../styles/recieptsListComponent.css';
import moment from 'moment';
import { updateReciept } from '../services/updateRecieptApi';
import { deleteReciept } from "../services/deleteRecieptApi";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { categories } from '../constants/categories';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReceiptListComponent = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [shopNameFilter, setShopNameFilter] = useState('');
    const [dateFilter, setDateFilter] = useState(null);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [category, setCategory] = useState('');

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            const data = await getReciepts();
            setReceipts(data.data.recieptsFound);
            setFilteredReceipts(data.data.recieptsFound);
        } catch (error) {
            message.error('Failed to fetch receipts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [shopNameFilter, dateFilter, sortField, sortOrder]);

    const applyFilters = () => {
        let filteredData = [...receipts];

        if (shopNameFilter) {
            filteredData = filteredData.filter(receipt =>
                receipt.shopName.toLowerCase().includes(shopNameFilter.toLowerCase())
            );
        }

        if (dateFilter && dateFilter.length === 2) {
            const startDate = new Date(dateFilter[0]);
            const endDate = new Date(dateFilter[1]);
        
            startDate.setUTCHours(0, 0, 0, 0);
            endDate.setUTCHours(23, 59, 59, 999);
        
            filteredData = filteredData.filter(receipt => {
                const invoiceDateStr = receipt.invoice_reciept_date;
                const [day, month, year] = invoiceDateStr.split('/');
                const receiptDate = new Date(Date.UTC(year, month - 1, day));
        
                return receiptDate >= startDate && receiptDate <= endDate;
            });
        }

        if (sortField && sortOrder) {
            filteredData.sort((a, b) => {
                if (sortField === 'shopName') {
                    return sortOrder === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
                } else if (sortField === 'invoice_reciept_date') {
                    const [dayA, monthA, yearA] = a[sortField].split('/');
                    const [dayB, monthB, yearB] = b[sortField].split('/');
    
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
    
                    if (sortOrder === 'asc') {
                        return dateA - dateB;
                    } else {
                        return dateB - dateA;
                    }
                }
                return 0;
            });
        }

        setFilteredReceipts(filteredData);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleNameSearch = (value) => {
        setShopNameFilter(value);
    };

    const handleDateRangeChange = (dates) => {
        setDateFilter(dates);
    };

    const resetFilters = () => {
        setShopNameFilter('');
        setDateFilter(null);
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const openModal = (receipt) => {
        setCurrentReceipt(receipt);
        setCategory(receipt.category);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const confirm = async (id) => {
        try {
            const response = await deleteReciept({ _id: id });
            message.success(response.data.message);
            fetchReceipts();
        } catch (err) {
            message.error(err.message);
        }
    };

    const handleSave = async () => {
        try {
            if (currentReceipt) {
                const formattedDate = currentReceipt.invoice_reciept_date ? moment(currentReceipt.invoice_reciept_date, ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD']).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY');
                setCurrentReceipt({ ...currentReceipt, invoice_reciept_date: formattedDate, category }); // Update category in current receipt
                const response = await updateReciept({ ...currentReceipt, invoice_reciept_date: formattedDate, category }); // Include category in update request
                closeModal();
                message.success(response.data.message);
                fetchReceipts();
            }
        } catch (err) {
            message.error(err.response.message);
        }
    };

    const getSortButtonContent = (field) => {
        if (field === sortField) {
            return sortOrder === 'asc' ? `${field} ▲` : `${field} ▼`;
        }
        return `${field} ⏷`;
    };

    const paginatedReceipts = filteredReceipts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="receipt-list-container">
            <h2 style={{ fontWeight: 'bold', margin:"10px" }}>Receipts</h2>
            <div className="filters-container">
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ float: 'right' }}>
                        <Button onClick={() => handleSort('shopName')} style={{ marginRight: 10 }}>{getSortButtonContent('shopName')}</Button>
                        <Button onClick={() => handleSort('invoice_reciept_date')}>{getSortButtonContent('invoice_reciept_date')}</Button>
                    </div>
                    <div style={{ float: 'right', marginRight: 10 }}>
                        <Search
                            placeholder="Search by shop name"
                            value={shopNameFilter}
                            onChange={(e) => handleNameSearch(e.target.value)}
                            onSearch={applyFilters}
                            style={{ width: 200 }}
                        />
                    </div>
                    <div style={{ float: 'right', marginRight: 10 }}>
                        <RangePicker
                            value={dateFilter}
                            onChange={handleDateRangeChange}
                            style={{ marginRight: 10 }}
                            format="DD/MM/YYYY"
                        />
                    </div>
                    <div style={{ float: 'right', marginRight: 10 }}>
                        <Button onClick={applyFilters} type="primary" style={{ marginRight: 10 }}>Search</Button>
                        <Button onClick={resetFilters}>Reset</Button>
                    </div>
                </div>
            </div>
            <div className="list-container" style={{ marginTop: '20px' }}>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={paginatedReceipts}
                    renderItem={receipt => (
                        <List.Item className="receipt-list-item">
                            <List.Item.Meta
                                avatar={<Image width={100} height={100} src={receipt.reciept_object_url || 'https://via.placeholder.com/100'} />}
                                title={`Shop: ${receipt.shopName}`}
                                description={(
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p><strong>Total:</strong> {receipt.total}</p>
                                            <p><strong>Date:</strong> {receipt.invoice_reciept_date}</p>
                                        </div>
                                        <div>
                                            <Button
                                                type="primary"
                                                icon={<EditOutlined />}
                                                onClick={() => openModal(receipt)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                More Details
                                            </Button>
                                            <Popconfirm
                                                title="Delete the task"
                                                description="Are you sure to delete this reciept?"
                                                onConfirm={(e) => confirm(receipt._id)}
                                                onCancel={(e) => console.log(e)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    type="default"
                                                    icon={<DeleteOutlined />}
                                                    style={{
                                                        backgroundColor: '#f0f0f0',
                                                        color: '#ff4d4f',
                                                        border: '1px solid #ff4d4f',
                                                        borderColor: '#ff4d4f',
                                                    }}
                                                >
                                                    Delete
                                                </Button>

                                            </Popconfirm>
                                        </div>
                                    </div>
                                )}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredReceipts.length}
                onChange={handlePageChange}
                className="pagination"
            />
            <Modal
                title="Receipt Details"
                visible={modalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="cancel" onClick={closeModal}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={handleSave}>Update</Button>,
                ]}
            >
                {currentReceipt && (
                    <Form layout="vertical">
                        <Form.Item label="Shop Name">
                            <Input value={currentReceipt.shopName} onChange={(value) => setCurrentReceipt({ ...currentReceipt, shopName: value })} />
                        </Form.Item>
                        <Form.Item label="Category">
                            <Select value={category} onChange={(value) => setCategory(value)} style={{ width: '100%' }}>
                                {categories.map((category) => (
                                    <Option key={category} value={category}>
                                        {category}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Amount Paid">
                            <InputNumber value={currentReceipt.amountPaid} onChange={(value) => setCurrentReceipt({ ...currentReceipt, amountPaid: value })} />
                        </Form.Item>
                        <Form.Item label="Discount">
                            <InputNumber value={currentReceipt.discount} onChange={(value) => setCurrentReceipt({ ...currentReceipt, discount: value })} />
                        </Form.Item>
                        <Form.Item label="Invoice Receipt Date (DD/MM/YYYY)">
                                <Input value={currentReceipt.invoice_reciept_date} onChange={(e) => setCurrentReceipt({ ...currentReceipt, invoice_reciept_date: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Tax">
                            <InputNumber value={currentReceipt.tax} onChange={(value) => setCurrentReceipt({ ...currentReceipt, tax: value })} />
                        </Form.Item>
                        <Form.Item label="Total">
                            <InputNumber value={currentReceipt.total} onChange={(value) => setCurrentReceipt({ ...currentReceipt, total: value })} />
                        </Form.Item>
                        <Form.Item label="Vendor Name">
                            <Input value={currentReceipt.vendor_name} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendor_name: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Vendor Phone">
                            <Input value={currentReceipt.vendor_phone} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendor_phone: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Vendor URL">
                            <Input value={currentReceipt.vendor_url} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendor_url: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Address">
                            <Input value={currentReceipt.vendorAddress?.ADDRESS} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, ADDRESS: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="Street">
                            <Input value={currentReceipt.vendorAddress?.STREET} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, STREET: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="City">
                            <Input value={currentReceipt.vendorAddress?.CITY} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, CITY: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="State">
                            <Input value={currentReceipt.vendorAddress?.STATE} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, STATE: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="Zip Code">
                            <Input value={currentReceipt.vendorAddress?.ZIP_CODE} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, ZIP_CODE: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="Address Block">
                            <Input value={currentReceipt.vendorAddress?.ADDRESS_BLOCK} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, ADDRESS_BLOCK: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="Vendor Address">
                            <Input value={currentReceipt.vendorAddress?.VENDOR_ADDRESS} onChange={(e) => setCurrentReceipt({ ...currentReceipt, vendorAddress: { ...currentReceipt.vendorAddress, VENDOR_ADDRESS: e.target.value } })} />
                        </Form.Item>
                        <Form.Item label="Line Items">
                            {currentReceipt.lineItems.map((item, index) => (
                                <div key={index} style={{ marginBottom: 20 }}>
                                    <Form.Item label="Item">
                                        <Input value={item.ITEM} onChange={(e) => {
                                            const updatedLineItems = [...currentReceipt.lineItems];
                                            updatedLineItems[index].ITEM = e.target.value;
                                            setCurrentReceipt({ ...currentReceipt, lineItems: updatedLineItems });
                                        }} />
                                    </Form.Item>
                                    <Form.Item label="Price">
                                        <Input value={item.PRICE} onChange={(e) => {
                                            const updatedLineItems = [...currentReceipt.lineItems];
                                            updatedLineItems[index].PRICE = e.target.value;
                                            setCurrentReceipt({ ...currentReceipt, lineItems: updatedLineItems });
                                        }} />
                                    </Form.Item>
                                    <Form.Item label="Quantity">
                                        <Input value={item.QUANTITY} onChange={(e) => {
                                            const updatedLineItems = [...currentReceipt.lineItems];
                                            updatedLineItems[index].QUANTITY = e.target.value;
                                            setCurrentReceipt({ ...currentReceipt, lineItems: updatedLineItems });
                                        }} />
                                    </Form.Item>
                                    <Form.Item label="Unit Price">
                                        <Input value={item.UNIT_PRICE} onChange={(e) => {
                                            const updatedLineItems = [...currentReceipt.lineItems];
                                            updatedLineItems[index].UNIT_PRICE = e.target.value;
                                            setCurrentReceipt({ ...currentReceipt, lineItems: updatedLineItems });
                                        }} />
                                    </Form.Item>
                                    <Form.Item label="Expense Row">
                                        <Input value={item.EXPENSE_ROW} onChange={(e) => {
                                            const updatedLineItems = [...currentReceipt.lineItems];
                                            updatedLineItems[index].EXPENSE_ROW = e.target.value;
                                            setCurrentReceipt({ ...currentReceipt, lineItems: updatedLineItems });
                                        }} />
                                    </Form.Item>
                                </div>
                            ))}
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default ReceiptListComponent;
