import React from 'react';
import { Calendar, theme } from 'antd';

const CalendarComponent = ({onPanelChange,onSelect,value}) => {
    const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    height: '100%',
    margin:"5px",
  };
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} value={value} onChange={onPanelChange} onSelect={onSelect}/>
    </div>
  );
};

export default CalendarComponent;
