import React from 'react';
import { formatDate } from '../utils';
import './items.css';

const ItemDetails = ({ item, image, notification, onClose }) => {
    if (!item) return null;

    return (
        <div className="item-details">
            <div className="item-details-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{item.title}</h2>
                <img className={notification ? 'notification-image' : 'enlarged-image'} src={`data:${image ? image.type : item.image_type};base64,${image ? image.image : item.image}`} alt={item.title} />
                {notification && (
                    <>
                        <p><strong>Starting Price:</strong> &pound;{item.startingPrice}</p>
                        <p><strong>Final Bid:</strong> &pound;{item.final_price}</p>
                        <p><strong>Auction End Date</strong>{formatDate(item.auctionEnd)}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ItemDetails;
