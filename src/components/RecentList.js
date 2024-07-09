import React from 'react';
import { Image, List, Card } from 'antd';

const RecentListComponent = ({ receipts }) => (
  <Card bordered={true} title="Recent Reciepts" style={{ margin: "5px", maxHeight: "400px", overflowY: "auto" }}>
    <List
      itemLayout="horizontal"
      dataSource={receipts}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            title={item.shopName}
            avatar={<Image width={100} height={100} src={item.reciept_object_url || 'https://via.placeholder.com/100'} />}
            description={<>
              <b>{item.total}</b>
              <p>{item.invoice_reciept_date}</p>
            </>}
          />
        </List.Item>
      )}
    />
  </Card>
);

export default RecentListComponent;
