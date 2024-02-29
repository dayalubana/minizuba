import React from 'react';

const OrderLineItem = ({ orderLine }) => {
  return (
    <div>
      <p>OrderLineID: {orderLine.OrderLineID}</p>
      <p>Description: {orderLine.Description}</p>
      {/* Render other details */}
    </div>
  );
};

export default OrderLineItem;