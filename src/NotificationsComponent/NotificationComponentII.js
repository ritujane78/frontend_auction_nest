import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import ItemDetails from '../ItemComponent/ItemDetails';
import './notifications.css';  

const NotificationComponentII = forwardRef(({ items, notifications }, ref) => {
    const [userNotifications, setUserNotifications] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            setSelectedItem(null);
        }
    };

    useEffect(() => {
        if (selectedItem) {
            document.addEventListener('keydown', handleEscKey);
        } else {
            document.removeEventListener('keydown', handleEscKey);
        }
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [selectedItem]);

    const refreshNotifications = () => {
        const f = notifications.map(notification => {
            const itemDetails = items.find(item => Number(item.id) === Number(notification.item_id));
            return { ...notification, itemDetails };
        });
        f.sort((a,b) => new Date(b.time) - new Date(a.time));
        setUserNotifications(f);
    };

    useImperativeHandle(ref, () => ({
        refresh: refreshNotifications
    }));

    useEffect(() => {
        refreshNotifications();
    }, [notifications, items]);

    return (
        <div className="notifications-dropdown">
            {userNotifications.length > 0 ? (
                userNotifications.map((notification, index) => (
                    <div key={index} className="notification">
                        {notification.itemDetails && (
                            <img 
                                className="upload-image" 
                                src={`data:${notification.itemDetails.image_type};base64,${notification.itemDetails.image}`} 
                                alt={`Item ${notification.item_id}`} 
                                onClick={()=> { return (setSelectedItem(notification.itemDetails))}}
                            />
                        )}
                        <p>{notification.message}</p>
                        
                    </div>
                ))
            ) : (
                <div className="notification">
                    <p>No notifications available</p>
                </div>
            )}
            {selectedItem && (
                <ItemDetails item={selectedItem}  onClose={() => {
                    return(setSelectedItem(null))
                    }
                } />
            )}
        </div>
    );
});

export default NotificationComponentII;
