import React,{useState} from 'react';
import {
  UserOutlined, DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import UploadComponent from '../components/Upload';
import RecieptList from "../components/RecieptList";

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
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '4'),
    getItem('Bill', '5'),
    getItem('Alex', '6'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '7'), getItem('Team 2', '8')]),
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
        return 'Content for Option 1';
      case '2':
        return <UploadComponent/>;
      case '3':
        return 'Content for Option 3';
      case '4':
        return 'Content for User Tom';
      case '5':
        return 'Content for User Bill';
      case '6':
        return 'Content for User Alex';
      case '7':
        return 'Content for Team 1';
      case '8':
        return 'Content for Team 2';
      case '9':
        return <RecieptList/>;
      default:
        return 'Select an option from the menu';
    }
  };



  return (
    <Layout
    style={{
      minHeight: '100vh',
    }}
  >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="logo" style={{ textAlign: 'center', padding: '16px' }}>
          <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto', borderRadius: '50%' }} />
        </div>
        <Menu theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
    </Sider>
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      />
      <Content
        style={{
          margin: '0 16px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100vh - 64px - 70px - 32px)',
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
        Recieptsy ©{new Date().getFullYear()} Created by Recieptsy
      </Footer>
    </Layout>
  </Layout>
  );
}
