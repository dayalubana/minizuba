import React, { useState } from 'react';

const FilterComponent = ({ onFilter }) => {
  const [quantity, setQuantity] = useState('');

  const handleFilterChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(quantity);
  };

  return (
    <div className="filter-component">
      <form onSubmit={handleSubmit}>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={handleFilterChange} />
        </label>
        <button type="submit">Apply Filter</button>
      </form>
    </div>
  );
};

export default FilterComponent;
