import React, { useState, useEffect } from 'react';
// import OrderLineItem from './OrderLineItem';
import FilterComponent from './Filter';
const OrderLinesList = () => {
  const [dataChunks, setDataChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const chunkSize = 30; // Number of records per chunk
  const initialChunksToLoad = 1; // Number of initial chunks to load
  const [allDataChunks, setAllDataChunks] = useState([]);
  const [filteredQuantity, setFilteredQuantity] = useState('');

// not sorted based on ordetline
// give color code based on package type
// 
  useEffect(() => {
    fetchData();
  }, []); // Fetch initial data chunks on component mount

  const fetchData = async () => {
    try {
      setLoading(true);
    //   const response = await fetch('https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=1&quantity=6');
      const requests = Array.from({ length: 14 }, (_, index) =>
        fetch(`https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=${index + 1}`)
      );
      const responses = await Promise.all(requests);
      const allData = await Promise.all(responses.map(response => response.json()));
      const flattenedData = allData.flat();
      setAllDataChunks(flattenedData);
      debugger
      const chunkedData = chunkArray(flattenedData, chunkSize);
      const data = chunkedData.slice(0, initialChunksToLoad);
      setDataChunks(data); // Load initial chunks
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, (index + 1) * size)
    );

//   const handleScroll = () => {
//     // Check if user has scrolled to the bottom of the table
//     if (
//       Math.ceil(window.innerHeight + document.documentElement.scrollTop) >=
//       Math.floor(document.documentElement.offsetHeight)
//     ) {
//       loadNextChunk();
//     }
//   };

  const handleScroll = () => {
    // debugger
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
  
    const { scrollTop, clientHeight, scrollHeight } = tableContainer;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadNextChunk();
    }
  };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [dataChunks]); 

useEffect(() => {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
  
    tableContainer.addEventListener('scroll', handleScroll);
    return () => {
      tableContainer.removeEventListener('scroll', handleScroll);
    };
  }, [dataChunks]);

  useEffect(() => {
    filterData();
  }, [filteredQuantity]);

  const loadNextChunk = () => {
    debugger
    setLoading(true);
    
    const nextChunkIndex = dataChunks.length;
    if(filteredQuantity.trim().length){
        // setDataChunks([]);
        const filteredData = allDataChunks.filter(item => item.Quantity === parseInt(filteredQuantity));
        if (nextChunkIndex * chunkSize < filteredData.length) {
            const nextChunk = filteredData
            .slice(nextChunkIndex * chunkSize, (nextChunkIndex + 1) * chunkSize);
            setDataChunks(prevChunks => [...prevChunks, nextChunk]);
            setLoading(false);
        } else{
          setLoading(false);
        }
    } else{
        if (nextChunkIndex * chunkSize < allDataChunks.length) {
            const nextChunk = allDataChunks.slice(nextChunkIndex * chunkSize, (nextChunkIndex + 1) * chunkSize);
            setDataChunks(prevChunks => [...prevChunks, nextChunk]);
            setLoading(false);
        }else{
          setLoading(false);
        }
    }
    
  };

  const handleFilter = (quantity) => {
    setFilteredQuantity(quantity);
  };

  const filterData = () => {
    setLoading(true);
    setDataChunks([]);
    setTimeout(() => {
      debugger
      if (filteredQuantity.trim() === '') {
        // If the quantity filter is empty, display all data
          setDataChunks(chunkArray(allDataChunks, chunkSize).slice(0, initialChunksToLoad));
          setLoading(false);
      } else {
        // Filter data by quantity
        const filteredData = allDataChunks.filter(item => item.Quantity === parseInt(filteredQuantity));
        filteredData.sort((a,b)=>a-b);
        const chunkedData = chunkArray(filteredData, chunkSize);
        
          setDataChunks(chunkedData.slice(0, initialChunksToLoad));
          setLoading(false);
      //   const tableContainer = document.querySelector('.table-container');
      //     if (!tableContainer) return;
  
      //     tableContainer.scrollIntoView();
      }
    }, 1000);
    
  };

  return (
    <div className="container mt-4">
        <FilterComponent onFilter={handleFilter} />
      <div className="table-container" style={{ height: '400px', overflowY: 'auto' }}> {/* Add overflowY: 'auto' for scrolling */}
        {!loading ? (
            
          <table className="table table-striped table-hover sticky-top">
            <thead className="thead-dark sticky-top">
              <tr className="table-dark">
                <th>OrderLineID</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>PackageTypeID</th>
                <th>Unit Price</th>
                {/* Add more table headers */}
              </tr>
            </thead>
            {dataChunks.length?
            <tbody>
              {dataChunks.map((chunk, chunkIndex) => (
                <React.Fragment key={chunkIndex}>
                  {chunk.map((item, index) => (
                    <tr key={`${chunkIndex}-${index}`}>
                      <td>{item.OrderLineID}</td>
                      <td>{item.Description}</td>
                      <td>{item.Quantity}</td>
                      <td>{item.PackageTypeID}</td>
                      <td>{item.UnitPrice}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            : (          <p>No Data Available</p>)            } 
          </table>):<span>Fetching Data...</span>
         }
      </div>
    </div>
  );
};

export default OrderLinesList;
