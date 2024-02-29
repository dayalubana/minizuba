import React, { useState } from 'react';

const FilterComponent = ({ onFilter }) => {
  const [quantity, setQuantity] = useState('');

  const handleFilter = () => {
    // Pass the quantity value to the parent component for filtering
    onFilter(quantity);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />&nbsp;
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleFilter}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
