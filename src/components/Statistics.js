import React, { useEffect, useState } from 'react';
import { Col, Row, Statistic, Card } from 'antd';

const wrapperStyle = {
    width: '100%',
    height: '100%',
    margin:"5px"
};

const StatisticsComponent = ({ receipts }) => {
    const [totalSpendingsThisMonth, setTotalSpendingsThisMonth] = useState(0);
    const [totalRecieptsThisMonth, setTotalRecieptsThisMonth] = useState(0);

    const totalSum = receipts.reduce((sum, receipt) => sum + Number(receipt.total), 0);

    const filterReceiptsByCurrentMonthAndYear = (receipts) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return receipts.filter(receipt => {
            const invoiceDate = new Date(receipt.invoice_reciept_date);
            invoiceDate.setDate(invoiceDate.getDate() + 1);
            return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
        });
    }


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