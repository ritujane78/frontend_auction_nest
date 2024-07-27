import React, { useEffect, useState } from 'react';
import './notifications.css'; 

const Notification = ({ items }) => {
    const [notifications, setNotifications] = useState([]);
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        setNotifications(items);
        checkNotifications(items);
    }, [items]);

    const checkNotifications = (items) => {
        const currentTime = new Date();
        const userId = localStorage.getItem("userId");
        const hasNotif = items.some(item => {
            return (item.winner_id == userId && currentTime > new Date(item.auctionEnd)) ||
                   (item.user_id == userId && currentTime > new Date(item.auctionEnd));
        });
        setHasNotifications(hasNotif);
    };

    const currentTime = new Date();
    const userId = localStorage.getItem("userId");

    return (
        <div className="notifications-dropdown">
            {hasNotifications ? (
                notifications.map((notification, index) => {
                    const isWinner = notification.winner_id == userId && currentTime > new Date(notification.auctionEnd);
                    const isUserItem = notification.user_id == userId && currentTime > new Date(notification.auctionEnd);
                    const isBidFor = currentTime > new Date(notification.auctionEnd) && notification.bidder_id == userId;
                    return (
                        (isWinner || isUserItem || isBidFor) && (
                            <div key={index} className="notification">
                                <img className="upload-image" src={`data:${notification.image_type};base64,${notification.image}`} alt={`Item ${notification.item_id}`} />
                                {isWinner && (
                                    <p>Congratulations! You have won the auction for this item.</p>
                                )}
                                {isUserItem && (
                                    <p>The auction for this item has ended.</p>
                                )}
                                {isBidFor && (
                                    <p>The auction you bid for has ended.</p>
                                )}
                            </div>
                        )
                    );
                })
            ) : (
                <div className="notification">
                    <p>No notifications available</p>
                </div>
            )}
        </div>
    );
};

export default Notification;
