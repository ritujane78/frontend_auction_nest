import React, { useEffect, useState } from 'react';
import './notifications.css'; 

const Notification = ({ items, bids }) => {
    const [notifications, setNotifications] = useState([]);
    const [auctionEndNotifications, setAuctionEndNotifications] = useState([]);
    const [isCheckCompleted, setIsCheckCompleted] = useState(false);

    useEffect(() => {
        setNotifications(items);
        checkNotifications(items, bids);
    }, [items, bids]);

    const checkNotifications = (items, bids) => {
        const currentTime = new Date();
        const userId = localStorage.getItem("userId");

        // Check for auction end notifications
        const endedAuctions = items.filter(item => {
            const bidItem = bids.find(([id, _]) => id == item.id);
            return bidItem && currentTime > new Date(item.auctionEnd);
        });

        setAuctionEndNotifications(endedAuctions);
        setIsCheckCompleted(true); // Indicate that the check is complete
    };

    const currentTime = new Date();
    const userId = localStorage.getItem("userId");

    const hasNotifications = notifications.some(notification => {
        const isWinner = notification.winner_id == userId && currentTime > new Date(notification.auctionEnd);
        const isUserItem = notification.user_id == userId && currentTime > new Date(notification.auctionEnd);
        return isWinner || isUserItem;
    });

    return (
        <div className="notifications-dropdown">
            {isCheckCompleted ? (
                hasNotifications || auctionEndNotifications.length > 0 ? (
                    <>
                        {notifications.map((notification, index) => {
                            const isWinner = notification.winner_id == userId && currentTime > new Date(notification.auctionEnd);
                            const isUserItem = notification.user_id == userId && currentTime > new Date(notification.auctionEnd);
                            return (
                                (isWinner || isUserItem) && (
                                    <div key={index} className="notification">
                                        <img className="upload-image" src={`data:${notification.image_type};base64,${notification.image}`} alt={`Item ${notification.item_id}`} />
                                        {isWinner && (
                                            <p>Congratulations! You have won the auction for this item.</p>
                                        )}
                                        {isUserItem && (
                                            <p>The auction for this item has ended.</p>
                                        )}
                                    </div>
                                )
                            );
                        })}
                        {auctionEndNotifications.map((item, index) => (
                            <div key={index} className="notification">
                                <img className="upload-image" src={`data:${item.image_type};base64,${item.image}`} alt={`Item ${item.id}`} />
                                <p>The auction for this item you bid on has ended.</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="notification">
                        <p>No notifications available</p>
                    </div>
                )
            ) : (
                <div className="notification">
                    <p>Loading notifications...</p>
                </div>
            )}
        </div>
    );
};

export default Notification;
