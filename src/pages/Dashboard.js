import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import UploadComponent from '../components/Upload';
import RecieptList from '../components/RecieptList';
import AnalyticsComponent from '../components/Analytics';

import config from '../config/index.json';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Analytics', '1', <PieChartOutlined />),
  getItem('Upload Reciept', '2', <UploadOutlined />),
  getItem('Option 3', '3', <DesktopOutlined />),
  getItem('Reciepts', '9', <FileOutlined />),
];

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { company } = config;
  const { logo } = company;

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <AnalyticsComponent/>;
      case '2':
        return <UploadComponent />;
      case '3':
        return 'Content for Option 3';
      case '9':
        return <RecieptList />;
      default:
        return 'Select an option from the menu';
    }
  };

  return (
    <Layout hasSider style={{
      minHeight: '100vh'
    }}>
      <Sider
        collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
         <div className="logo" style={{ textAlign: 'center', padding: '16px' }}>
      <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto', borderRadius: '50%' }} />
     </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={handleMenuClick}/>
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
           {renderContent()}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
