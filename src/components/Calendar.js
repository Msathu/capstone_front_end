import React from 'react';
import { Calendar, theme } from 'antd';

const CalendarComponent = ({onPanelChange}) => {
    const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onChange={onPanelChange} />
    </div>
  );
};

export default CalendarComponent;
