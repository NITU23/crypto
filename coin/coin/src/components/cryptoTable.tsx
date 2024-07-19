'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchCoins, clearCoins } from '../redux/cryptoSlice';
import '../css/file.css';

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const cryptoData = useSelector((state: RootState) => state.crypto.coins);
  const loading = useSelector((state: RootState) => state.crypto.loading);
  const error = useSelector((state: RootState) => state.crypto.error);

  useEffect(() => {
    dispatch(clearCoins()); 
    dispatch(fetchCoins(selectedCode)); 

    const interval = setInterval(() => {
      dispatch(clearCoins()); 
      dispatch(fetchCoins(selectedCode)); 
    }, 5000);

    return () => clearInterval(interval); 
  }, [dispatch, selectedCode]); 

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCode(e.target.value); 
  };

  const handleModalOpen = () => {
    setIsModalOpen(true); 
  };

  const handleModalClose = () => {
    setIsModalOpen(false); 
  };

  return (
    <div>
      <h2>Crypto Table</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!selectedCode && !loading && !error && (
        <>
          <h3>No coin selected. Please select a coin.</h3>
       
        </>
      )}

      {cryptoData.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Rate</th>
                <th>Cap</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((coin) => (
                <tr key={coin.code}>
                  <td>{coin.code}</td>
                  <td>{coin.rate}</td>
                  <td>{coin.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
          )}<>
          <button className='changeButton' onClick={handleModalOpen}>Change Stock/Crypto</button>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <select
                  value={selectedCode}
                  onChange={handleCodeChange}
                >
                  <option value="">Select a coin</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="SOL">SOL</option>
                  <option value="BNB">BNB</option>
                </select>
                <div className='buttonClass'>
                  <button onClick={handleModalClose}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
   
    </div>
  );
};

export default CryptoTable;
