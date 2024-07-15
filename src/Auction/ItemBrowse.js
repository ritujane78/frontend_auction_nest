// src/ImageBrowse.js
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import '../main.css';

const ItemBrowse = forwardRef(({ onBidSubmit }, ref) => {
    const [images, setImages] = useState([]);
    const [bidAmounts, setBidAmounts] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const response = await axios.get('/item/items');
        setImages(response.data);
    };

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
            alert("Please signin first!")

            return;
        } else {
            // if (!bidAmount) {
            //     alert('Please enter a bid amount.');
            //     return;
            // }

            const success = await onBidSubmit(itemId, bidAmount);
            // if (success) {
                setBidAmounts({
                    ...bidAmounts,
                    [itemId]: ''
                });
            // }
            }
        
    };

    return (
            <div id="imagesContainer">
                {images.map(imageData => (
                    <div key={imageData.id} className="image-card">
                        <img src={`data:${imageData.type};base64,${imageData.image}`} alt={imageData.title} />
                        {/* <p className='title'>{imageData.title}</p> */}
                        <p className='description'>{imageData.description}</p>
                        <p> Size: {imageData.size}</p>
                        <p> Current Price: &pound;{imageData.startingPrice}</p>

                        <div className="inline-elements">
                        <label htmlFor={`bid-${imageData.id}`}>Bid:</label>
                            <input
                                type="number"
                                id={`bid-${imageData.id}`}
                                name={`bid-${imageData.id}`}
                                value={bidAmounts[imageData.id] || ''}
                                onChange={(e) => handleBidChange(imageData.id, e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => handleBidSubmit(imageData.id)}>Go</button>
                        </div>
                    </div>
                ))}
            </div>
    );
});

export default ItemBrowse;
