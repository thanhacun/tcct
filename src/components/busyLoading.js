import React from 'react';
import FontAwesome from 'react-fontawesome';

export default (BaseComponent) => ({message}) => {
  return (
    <div className="container text-center">
      <FontAwesome name="spinner" spin size="3x"/> {message}
    </div>
  );
};
