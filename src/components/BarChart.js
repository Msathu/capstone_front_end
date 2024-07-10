import { Card, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const addSymbols = (e) => {
  const suffixes = ["", "K", "M", "B"];
  let order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
  if (order > suffixes.length - 1) order = suffixes.length - 1;
  const suffix = suffixes[order];
  return CanvasJSReact.CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
};

const BarChartComponent = ({ receipts }) => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
  const [chartData, setChartData] = useState([]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setChartData([]);
    }
  };

  const filterReceipts = (dates) => {
    const [startDate, endDate] = dates;
    const start = startDate.toDate();
    const end = endDate.toDate();

    const filtered = receipts.filter(receipt => {
      const receiptDate = dayjs(receipt.invoice_reciept_date, 'DD/MM/YYYY').toDate();
      return dayjs(receiptDate).isBetween(start, end, 'day', '[]');
    });

    const categoryTotals = filtered.reduce((acc, receipt) => {
      const category = receipt.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(receipt.total);
      return acc;
    }, {});

    const dataPoints = Object.entries(categoryTotals).map(([name, amount]) => ({
      label: name,
      y: amount,
    }));

    setChartData(dataPoints);
  };

  useEffect(() => {
    filterReceipts(dateRange);
  }, [receipts, dateRange]);

  const options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Spendings for each category"
    },
    axisX: {
      title: "Spending Categories",
      reversed: true,
    },
    axisY: {
      title: "Spendings",
      includeZero: true,
      labelFormatter: addSymbols,
    },
    data: [{
      type: "bar",
      dataPoints: chartData
    }]
  };

  return (
    <Card bordered={true} style={{ alignContent: "center", height: "100%", marginTop: "5px" }}>
      <RangePicker onChange={handleDateChange} value={dateRange} format='DD/MM/YYYY' />
      <div style={{ marginTop: "30px" }}>
        <CanvasJSChart options={options} />
      </div>
    </Card>
  );
};

export default BarChartComponent;
