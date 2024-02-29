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
  const [filteredData, setFilteredData] = useState([]);
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
      setFilteredData(flattenedData);
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


  // const loadNextChunk = () => {
  //   setLoading(true);
  //   const nextChunkIndex = dataChunks.length;
  //   let filteredData = allDataChunks;
  //   if (filteredQuantity.trim().length) {
  //     filteredData = filteredData.filter(item => item.Quantity === parseInt(filteredQuantity));
  //   }
  //   const filteredDataLength = filteredData.length;
  //   if (nextChunkIndex * chunkSize < filteredDataLength) {
  //     let nextChunk = [];
  //     if (nextChunkIndex * chunkSize + chunkSize < filteredDataLength) {
  //       // If there are enough items for a full chunk, slice the next chunk and sort it
  //       nextChunk = filteredData
  //         .slice(nextChunkIndex * chunkSize, (nextChunkIndex + 1) * chunkSize)
  //         .sort((a, b) => a.OrderLineID - b.OrderLineID);
  //     } else {
  //       // If there are fewer items than a full chunk remaining, slice the remaining items and sort them
  //       nextChunk = filteredData
  //         .slice(nextChunkIndex * chunkSize)
  //         .sort((a, b) => a.OrderLineID - b.OrderLineID);
  //     }
  //     setDataChunks(prevChunks => [...prevChunks, nextChunk]);
  //   }
  //   setLoading(false);
  // };

  const loadNextChunk = () => {
    setLoading(true);
    const nextChunkIndex = dataChunks.length;
    if (nextChunkIndex * chunkSize < filteredData.length) {
      const nextChunk = filteredData.slice(nextChunkIndex * chunkSize, (nextChunkIndex + 1) * chunkSize);
      setDataChunks(prevChunks => [...prevChunks, nextChunk]);
    }
    setLoading(false);
  };

  const handleFilter = (quantity) => {
    setFilteredQuantity(quantity);
  };



  // const filterData = () => {
  //   setLoading(true);
  //   setDataChunks([]);
  //   setTimeout(() => {
  //     if (filteredQuantity.trim() === '') {
  //       const sortedData = allDataChunks.slice().sort((a, b) => a.OrderLineID - b.OrderLineID);
  //       const chunkedData = chunkArray(sortedData, chunkSize);
  //       setDataChunks(chunkedData.slice(0, initialChunksToLoad));
  //       setLoading(false);
  //     } else {
  //       const filteredData = allDataChunks.filter(item => item.Quantity === parseInt(filteredQuantity));
  //       const sortedData = filteredData.slice().sort((a, b) => a.OrderLineID - b.OrderLineID);
  //       const chunkedData = chunkArray(sortedData, chunkSize);
  //       setDataChunks(chunkedData.slice(0, initialChunksToLoad));
  //       setLoading(false);
  //     }
  //   }, 1000);
  // };

  const filterData = () => {
    setLoading(true);
    setDataChunks([]);
    setTimeout(() => {
      if (filteredQuantity.trim() === '') {
        const sortedData = allDataChunks.slice().sort((a, b) => a.OrderLineID - b.OrderLineID);
        setFilteredData(sortedData);
        const chunkedData = chunkArray(sortedData, chunkSize);
        setDataChunks(chunkedData.slice(0, initialChunksToLoad));
        setLoading(false);
      } else {
        const newFilteredData = allDataChunks.filter(item => item.Quantity === parseInt(filteredQuantity));
        newFilteredData.sort((a, b) => a.OrderLineID - b.OrderLineID);
        setFilteredData(newFilteredData);
        const chunkedData = chunkArray(newFilteredData, chunkSize);
        setDataChunks(chunkedData.slice(0, initialChunksToLoad));
        setLoading(false);
      }
    }, 1000);


  };
  const packageTypeColors = {
    1: 'mistyrose',
    2: 'powderblue',
    3: 'lightgray',
    4: 'peachpuff',
    5: 'mintcream',
    6: 'azure',
    7: 'aliceblue',
    8: 'lavenderblush',
    9: 'honeydew',
    10: 'beige',
    11: 'lightcyan',
    12: 'lightyellow',
    13: 'lightpink',
    14: 'lightlavender',
  };
  return (
    <div className="container mt-4">
      <FilterComponent onFilter={handleFilter} />
      <div className="table-container" style={{ height: '400px', overflowY: 'auto' }}>
        {!loading ? (
          <div>
          <table className="table table-hover sticky-top">
            <thead  className=" sticky-top">
              <tr className="table-dark">
                <th>OrderLineID</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>PackageTypeID</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {dataChunks.map((chunk, chunkIndex) => (
                <React.Fragment key={chunkIndex}>
                  {chunk.map((item, index) => (
                    <tr key={`${chunkIndex}-${index}`} style={{ backgroundColor: packageTypeColors[item.PackageTypeID] }}>
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
          </table>
          
          </div>
        ) : (
          <span>Fetching Data...</span>
        )}
      </div>
      {!loading ? (<div>Total Records: {filteredData.length}</div>):null }
    </div>
  );
};

export default OrderLinesList;
