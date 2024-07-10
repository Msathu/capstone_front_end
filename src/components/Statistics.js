import React, { useEffect, useState } from 'react';
import { Col, Row, Statistic, Card } from 'antd';
import moment from 'moment';
import { extractNumber } from '../utils/utils';

const wrapperStyle = {
    width: '100%',
    height: '100%',
    margin:"5px"
};

const StatisticsComponent = ({ receipts }) => {
    const [totalSpendingsThisMonth, setTotalSpendingsThisMonth] = useState(0);
    const [totalRecieptsThisMonth, setTotalRecieptsThisMonth] = useState(0);

    const totalSum = receipts.reduce((sum, receipt) => sum + Number(extractNumber(receipt.total)), 0);

    const filterReceiptsByCurrentMonthAndYear = () => {
        const start = moment().startOf('month');
        const end = moment().endOf('month');
    

    return receipts.filter(receipt => {
        const receiptDate = moment(receipt.invoice_reciept_date, 'DD/MM/YYYY').toDate();
      return moment(receiptDate).isBetween(start, end, 'day', '[]');
    });
  };


    useEffect(() => {
        if (receipts.length > 0) {
            const recieptsThisMonth = filterReceiptsByCurrentMonthAndYear(receipts);
            setTotalRecieptsThisMonth(recieptsThisMonth.length);
            const spendingsThisMonth = recieptsThisMonth.reduce((sum, receipt) => sum + Number(receipt.total), 0);
            setTotalSpendingsThisMonth(spendingsThisMonth);
        }
    }, [receipts])

    return (
        <div style={wrapperStyle}>
            <Card bordered={true} style={{ height: "100%" }} title="Spendings And Reciepts">
                <Row gutter={24}>
                    <Col xm={24} sm={12} lg={12}>
                        <Card bordered={true}>
                            <Statistic title="Total Reciepts" value={receipts.length} />
                        </Card>
                    </Col>
                    <Col xm={24} sm={12} lg={12}>
                        <Card bordered={true}>
                            <Statistic title="Total Spendings" value={totalSum} precision={2} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: "15px" }}>
                    <Col xm={24} sm={12} lg={12}>
                        <Card bordered={true}>
                            <Statistic title="Total Reciepts This Month" value={totalRecieptsThisMonth} />
                        </Card>
                    </Col>
                    <Col xm={24} sm={12} lg={12}>
                        <Card bordered={true}>
                            <Statistic title="Total Spendings This Month" value={totalSpendingsThisMonth} precision={2} />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>)
};
export default StatisticsComponent;