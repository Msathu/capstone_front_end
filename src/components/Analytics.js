import React, { useEffect, useState } from 'react';
import { Col, Row, message } from 'antd';
import CalendarComponent from './Calendar';
import StatisticsComponent from './Statistics';
import RecentListComponent from './RecentList';
import PieChartComponent from './PieChart';
import BarChartComponent from './BarChart';
import { getReciepts } from '../services/getRecieptsApi';
import dayjs from 'dayjs';

const AnalyticsComponent = () => {
    const [loading, setLoading] = useState(false);
    const [reciepts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [value, setValue] = useState(() => dayjs());
    const [selectedValue, setSelectedValue] = useState(() => dayjs());

    const datesAreEqual = (date1, date2) => {
        return date1.isSame(date2, 'day');
    }

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            const data = await getReciepts();
            setReceipts(data.data.recieptsFound);
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
        if (reciepts.length > 0) {
            const filtered = reciepts.filter(receipt => {
                const invoiceDateStr = receipt.invoice_reciept_date;
                const [day, month, year] = invoiceDateStr.split('/');
                const receiptDate = dayjs(`${year}-${month}-${day}`);
                return datesAreEqual(receiptDate, selectedValue);
            });
            setFilteredReceipts(filtered);
        }
    }, [selectedValue, reciepts]);

    const onPanelChange = (newValue) => {
        setValue(newValue);
    }

    const onSelect = (newValue) => {
        setValue(newValue);
        setSelectedValue(newValue);
    }

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={12}>
                    <CalendarComponent onPanelChange={onPanelChange} onSelect={onSelect} selectedValue={selectedValue} value={value} />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <StatisticsComponent receipts={reciepts} />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <RecentListComponent receipts={filteredReceipts} />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <PieChartComponent receipts={reciepts} />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} lg={24}>
                    <BarChartComponent receipts={reciepts} />
                </Col>
            </Row>
            {/* <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={12}>
                    <PieChartComponent receipts={reciepts} />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <BarChartComponent receipts={reciepts} />
                </Col>
            </Row> */}
        </div>
    );
};

export default AnalyticsComponent;
