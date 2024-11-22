import React from 'react';

interface HealthBarProps {
  value: number; // Percentuale di consumo
}

const HealthBar: React.FC<HealthBarProps> = ({ value }) => (
  <div
    style={{
      width: '200px',
      height: '20px',
      backgroundColor: 'gray',
      position: 'absolute',
      top: '10px',
      left: '10px',
    }}
  >
    <div
      style={{
        width: `${value}%`,
        height: '100%',
        backgroundColor: 'green',
      }}
    ></div>
  </div>
);

export default HealthBar;
