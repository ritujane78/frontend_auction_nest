import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import '../main.css';
import AlertDialog from '../AlertDialog/AlertDialog';

const ItemBrowse = forwardRef(({ onBidSubmit, filter }, ref, ) => {
    const [items, setItems] = useState([]);
    const [bidAmounts, setBidAmounts] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    const fetchItems = async () => {
        const response = await axios.get('/item/items');
        // setItems(response.data);
        setItems(response.data
            .filter(item => {
            const currentDate = new Date();
            const auctionStartDate = new Date(item.auctionStart);
            const auctionEndDate = new Date(item.auctionEnd);
            return (currentDate > auctionStartDate && currentDate<auctionEndDate)
        })
        .filter((item)=>item.isDonated === filter)
        .sort((a, b) => new Date(a.auctionEnd) - new Date(b.auctionEnd)));        

    };

    // const filteredItems = items
    // .filter(item => {
    //     const currentDate = new Date();
    //     const auctionStartDate = new Date(item.auctionStart);
    //     const auctionEndDate = new Date(item.auctionEnd);
    //     return (currentDate > auctionStartDate && currentDate<auctionEndDate)
    // })
    // .filter((item)=>item.isDonated === filter)
    // .sort((a, b) => new Date(a.auctionEnd) - new Date(b.auctionEnd));

    useEffect(() => {
        fetchItems();
    }, [bidAmounts]);


    useImperativeHandle(ref, () => ({
        fetchItems
    }));
    const handleBidChange = (itemId, value) => {
        setBidAmounts({
            ...bidAmounts,
            [itemId]: value
        });
    };

    const handleBidSubmit = async (itemId) => {
        const bidAmount = bidAmounts[itemId];
        const userId = localStorage.getItem("userId")
        if(!userId){
            setMessageAlert("Please Signin first!")
            handleShowAlert();

            return;
        } else {
            const success = await onBidSubmit(itemId, bidAmount);
            // if (success) {
                setBidAmounts({
                    ...bidAmounts,
                    [itemId]: ''
                });
            // }
            }
        
    };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };



    return (
            <div id="imagesContainer">
                {items.map(itemData => (
                    <div key={itemData.id} className="item-card">
                        <img src={`data:${itemData.type};base64,${itemData.image}`} alt={itemData.title} />
                        {/* <p className='title'>{itemData.title}</p> */}
                        <p className='description'>{itemData.description}</p>
                        
                        <p> Size: {itemData.size}</p>
                        <div className='bids'>
                            <p>Starting price: &pound;{itemData.startingPrice}</p>
                            <p> Current Bid: &pound;{itemData.currentPrice?itemData.currentPrice:itemData.startingPrice}</p>
                        </div>
                        <div className="inline-elements">
                        <label htmlFor={`bid-${itemData.id}`}>Bid:</label>
                            <input
                                type="number"
                                id={`bid-${itemData.id}`}
                                name={`bid-${itemData.id}`}
                                value={bidAmounts[itemData.id] || ''}
                                onChange={(e) => handleBidChange(itemData.id, e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => handleBidSubmit(itemData.id)}>Go</button>
                        </div>
                    </div>
                ))}
                {showAlert && (
                    <AlertDialog 
                        message= {messageAlert}
                        onClose={handleCloseAlert} 
                    />
                 )}
            </div>
    );
});

export default ItemBrowse;
