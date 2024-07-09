import { Card } from 'antd';
import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const PieChartComponent = ({ receipts }) => {
  const [chartData, setChartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);

    const handleDateChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
        setDateRange(dates);
      filterReceipts(dates);
    } else {
      setChartData([]);
      setTotalAmount(0);
    }
  };

    const filterReceipts = (dates) => {
        const [startDate, endDate] = dates;
        const start = startDate.toDate();
        const end = endDate.toDate();
    

    const filtered = receipts.filter(receipt => {
        const receiptDate = moment(receipt.invoice_reciept_date, 'DD/MM/YYYY').toDate();
      return moment(receiptDate).isBetween(start, end, 'day', '[]');
    });

    const categoryTotals = filtered.reduce((acc, receipt) => {
      const category = receipt.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(receipt.total);
      return acc;
    }, {});
    
        

    const totalAmount = Object.values(categoryTotals).reduce((acc, amount) => acc + amount, 0);
    setTotalAmount(totalAmount);

    const dataPoints = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      y: (amount / totalAmount) * 100,
    }));

    setChartData(dataPoints);
  };

  useEffect(() => {
    filterReceipts(dateRange);
  }, [receipts, dateRange]);

  const options = {
    animationEnabled: true,
    title: {
      text: "Receipt Categories"
    },
    subtitles: [{
      text: `Total: ${totalAmount.toLocaleString()}`,
      verticalAlign: "center",
      fontSize: 24,
      dockInsidePlotArea: true
    }],
    data: [{
      type: "doughnut",
      showInLegend: true,
      indexLabel: "{name}: {y}%",
      yValueFormatString: "#,###'%'",
      dataPoints: chartData
    }]
  };

  return (
    <Card bordered={true} style={{ "alignContent": "center", "margin": "5px" }}>
      <RangePicker onChange={handleDateChange} value={dateRange} />
      <div style={{ marginTop: "10px" }}>
        <CanvasJSChart options={options} />
      </div>
    </Card>
  );
};

export default PieChartComponent;
