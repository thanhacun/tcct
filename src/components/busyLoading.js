import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';

export default (BaseComponent) => ({message}) => {
  return (
    <div className="container text-center">
      <FontAwesome icon={`spinner`} spin size="3x"/> {message}
    </div>
  );
};
