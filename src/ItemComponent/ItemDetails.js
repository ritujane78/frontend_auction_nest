import React, { useEffect, useState } from 'react';
import { formatDate } from '../utils';
import './items.css';

const ItemDetails = ({ item, image, notification, onClose }) => {
    const [winnerInfo, setWinnerInfo] = useState({ name: '', email: '' });

    useEffect( ()=> {
        if (!item) return null;
        fetchWinner();
    },[item]);

    const fetchWinner = async ()=>{
        try {
            if (item.winner_id) {
                
                const response = await fetch(`/user/user/${item.winner_id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const user = await response.json();
                setWinnerInfo({ name: user.name, email: user.email });
            }

    } catch (err) {
        console.error(err);
    }
    }

    return (
        <div className="item-details">
            <div className="item-details-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{item.brandName} {item.category}</h2>
                <img className={notification ? 'notification-image' : 'enlarged-image'} src={`data:${image ? image.type : item.image_type};base64,${image ? image.image : item.image}`} alt={item.brandName} />
                {notification && (
                    <>
                        <div className='winner'>
                            <p><strong>Winner</strong> <br/>{winnerInfo.name} <br/> {winnerInfo.email} <br/></p>
                        </div>
                    </>
                    )}
                        <p><strong>Description: </strong> {item.description}</p>
                        <p><strong>Size:</strong> {item.size}</p>
                        <p><strong>Gender:</strong> {item.gender.toUpperCase()}</p>
                        <p><strong>Starting Price:</strong> &pound;{item.startingPrice}</p>
                        {!notification && item.final_price === null &&(
                            <>
                            <p><strong>Current Bid:</strong> &pound;{item.currentPrice?item.currentPrice:item.startingPrice}</p>
                            </>
                        )}
                        <p><strong>Final Bid:</strong>{item.final_price?' £':''}{item.final_price}</p>
                        <p><strong>Auction Start Date: </strong> {formatDate(item.auctionStart)}</p>
                        <p><strong>Auction End Date: </strong> {formatDate(item.auctionEnd)}</p>
                    
            </div>
        </div>
    );
};

export default ItemDetails;
