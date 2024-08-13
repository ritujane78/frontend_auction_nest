import React, { useEffect, useState } from 'react';
import { formatDate } from '../utils';
import './items.css';

const ItemDetails = ({ item, image, notification, onClose }) => {
    const [showWinnerInfo, setShowWinnerInfo] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);

    useEffect(() => {
        const fetchBidsHistory = async(item_id) => {
            try {
                const response = await fetch(`/bid/bids/${item_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBidHistory(data);

            } catch(err) {
                console.error(err);
            }
        }

        if (item.winner_id) {
            setShowWinnerInfo(true);
            fetchBidsHistory(item.id);
        } else if (item.bidder_id) {
            fetchBidsHistory(item.id);
        }

        if (!item) return null;
    }, [item, notification, bidHistory]);

    return (
        <div className="item-details">
            <div className="item-details-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{item.brandName} {item.title ? item.title : item.category}</h2>
                <img className={notification ? 'notification-image' : 'enlarged-image'} src={`data:${image ? image.type : item.image_type};base64,${image ? image.image : item.image}`} alt={item.brandName} />
                
                <p><strong>Description: </strong> {item.description}</p>
                <p><strong>Size:</strong> {item.size}</p>
                <p><strong>Gender:</strong> {item.gender.toUpperCase()}</p>
                <p><strong>Starting Price:</strong> &pound;{item.startingPrice}</p>

                {!notification && item.final_price === null && (
                    <p><strong>Current Bid:</strong> &pound;{item.currentPrice ? item.currentPrice : item.startingPrice}</p>
                )}
                
                {!notification && !item.winner_id &&  bidHistory.length > 0 &&(
                    <div className='bidder'>
                        <p><strong>Current Highest Bidder:</strong> {bidHistory[bidHistory.length-1].username}, {bidHistory[bidHistory.length-1].full_name}<br /></p>
                    </div>
                )}

                <p><strong>Bid(s):</strong> {item.bid_count}</p>

                <p><strong>Final Bid:</strong>{item.final_price ? ' £' : ''}{item.final_price}</p>

                {showWinnerInfo && bidHistory.length > 0 && (
                    <div className='winner'>
                        <p><strong>Winner:</strong> {bidHistory[bidHistory.length-1].username}, {bidHistory[bidHistory.length-1].full_name} </p>
                    </div>
                )}
                    {bidHistory.length > 0  && (
                    <div className='bid_history'>
                        <p className='title'><strong><u>Bid History</u></strong></p>
                        {bidHistory.map((bid, index) => (
                            <p key={index}>
                                <i><strong>Amount:</strong> £{bid.bid_amount.toFixed(2)} ,  
                                <strong>Bidder:</strong> {bid.username}</i>
                            </p>
                        ))}
                    </div>
                )}

                <p><strong>Auction Start Date: </strong> {formatDate(item.auctionStart)}</p>
                <p><strong>Auction End Date: </strong> {formatDate(item.auctionEnd)}</p>
            </div>
        </div>
    );
};

export default ItemDetails;
