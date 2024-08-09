import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import AlertDialog from '../AlertDialog/AlertDialog';
import ItemDetails from '../ItemComponent/ItemDetails';
import '../main.css';
import './auction.css';

const ItemBrowse = forwardRef(({ onBidSubmit, sortType, items, bidAmounts, setBidAmounts }, ref) => {
    const [localItems, setLocalItems] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); 


    const handleSortChange = useCallback((sortType, itemsToSort) => {
        const sizeOrder = ["xs", "s", "m", "l", "xl", "n/a"];
        let sortedItems = [...itemsToSort];
        if (sortType === "byAuctionEnd") {
            sortedItems.sort((a, b) => new Date(a.auctionEnd) - new Date(b.auctionEnd));
        } else if (sortType === "byCurrentBidHToL") {
            sortedItems.sort((a, b) => {
                const bidA = a.currentPrice || 0;
                const bidB = b.currentPrice || 0;
                if (bidA === 0 && bidB === 0) {
                    return parseFloat(b.startingPrice) - parseFloat(a.startingPrice);
                } else if (bidA === 0) {
                    return bidB - parseFloat(a.startingPrice);
                } else if (bidB === 0) {
                    return parseFloat(a.startingPrice) - bidA;
                } else {
                    return bidB - bidA;
                }
            });
        } else if (sortType === "byCurrentBidLToH") {
            sortedItems.sort((a, b) => {
                const bidA = a.currentPrice || 0;
                const bidB = b.currentPrice || 0;
                if (bidA === 0 && bidB === 0) {
                    return parseFloat(a.startingPrice) - parseFloat(b.startingPrice);
                } else if (bidA === 0) {
                    return parseFloat(a.startingPrice) - bidB;
                } else if (bidB === 0) {
                    return bidA - parseFloat(b.startingPrice);
                } else {
                    return bidA - bidB;
                }
            });
        } else if (sortType==="byBidsHtoL"){
            sortedItems.sort((a,b) => parseInt(b.bid_count) - parseInt(a.bid_count));
        } else if (sortType==="byBidsLtoH"){
            sortedItems.sort((a,b) => parseInt(a.bid_count) - parseInt(b.bid_count));
        } else if (sortType === "bySize") {
            sortedItems.sort((a, b) => sizeOrder.indexOf(a.size.toLowerCase()) - sizeOrder.indexOf(b.size.toLowerCase()));
        }
        setLocalItems(sortedItems);
    },[]);

    const fetchItems = useCallback(async () => {
        try {
            const itemsToSort = [...items];
            handleSortChange(sortType, itemsToSort);
        } catch (error) {
            console.error(`Error fetching data`, error);
            setErrorData("Error fetching data");
        } finally {
            setLoadingData(false);
        }
    }, [sortType, items, handleSortChange]);

    const showTimer = (itemsList) => {
        return itemsList.map(item => {
            const now = new Date();
            const endTime = new Date(item.auctionEnd);
            const difference = endTime - now;
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                item.days= days + 'D:';
                item.hours = hours + 'H:';
                item.minutes = minutes + 'M';
                if(days <= 0){
                    item.days = ''; 
                }
                if(hours<=0){
                    item.hours = '';
                }
                if(minutes <= 0){
                    item.hours = hours + 'H'
                    item.minutes = '';
                }
                if(hours<=0 && minutes <=0){
                    item.days = days + 'D'
                }
            }
            return item;
        });
    };

    
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

    useEffect(() => {
        fetchItems();
    }, [fetchItems, bidAmounts]);

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
        const userId = localStorage.getItem("userId");
        const minBidAmount = document.getElementById(`bid-${itemId}`).min;
        if (bidAmount < parseInt(minBidAmount) + 0.5) {
            setMessageAlert(`Please place a bid amount of at least \u00A3${parseInt(minBidAmount) + 0.5}`);
            setBidAmounts({
                ...bidAmounts,
                [itemId]: ''
            });
            handleShowAlert();
            return;
        }
        if (!userId) {
            setMessageAlert("Please Sign in first!");
            setBidAmounts({
                ...bidAmounts,
                [itemId]: ''
            });
            handleShowAlert();
            return;
        }
        if (!bidAmount) {
            setMessageAlert("Please Enter a Bid Amount.");
            handleShowAlert();
            return;
        }
        const success = await onBidSubmit(itemId, bidAmount);
        if (success) {
            setBidAmounts({
                ...bidAmounts,
                [itemId]: ''
            });
        }
    };

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const sortedAndTimedItems = showTimer(localItems);
    const userId = localStorage.getItem("userId");

    if (loadingData) return <div>Loading...</div>;
    if (errorData) return <div>{errorData}</div>;

    return (
        <div>
            <div id="items-container">
                {sortedAndTimedItems.map(itemData => (
                    <div key={itemData.id} className="item-card" >
                        <h3 className='timer'>{itemData.days}{itemData.hours}{itemData.minutes}</h3>
                        <p className='category'>{itemData.title? itemData.title.toUpperCase(): itemData.category.toUpperCase()}</p>
                        <img src={`data:${itemData.type};base64,${itemData.image}`} alt={itemData.brandName} onClick={() => setSelectedItem(itemData)}/>
                        <p className='itemSize'>Size: {itemData.size}</p>
                        <div className='bids'>
                            <p>Current Bid: &pound;{itemData.currentPrice ? itemData.currentPrice : itemData.startingPrice}</p>
                            <p>Bid(s): {itemData.bid_count}</p>
                        </div>
                        {/* <div className='bids'>
                            <p>Bid(s): {itemData.bid_count}</p>
                        </div> */}
                        <div className="inline-elements">
                            <label htmlFor={`bid-${itemData.id}`}>Bid:</label>
                            <input
                                type="number"
                                min={itemData.currentPrice ? itemData.currentPrice : itemData.startingPrice}
                                placeholder={`${itemData.user_id === Number(userId) ? ' 🛇' : `min. £${(itemData.currentPrice ? itemData.currentPrice : itemData.startingPrice) + 0.5}`}`}
                                id={`bid-${itemData.id}`}
                                name={`bid-${itemData.id}`}
                                value={bidAmounts[itemData.id] || ''}
                                onChange={(e) => handleBidChange(itemData.id, e.target.value)}
                                required
                                disabled={itemData.user_id === Number(userId)}
                            />
                            <button type="button" onClick={() => handleBidSubmit(itemData.id)} disabled={itemData.user_id === Number(userId)}>Go</button>
                        </div>
                    </div>
                ))}
                {showAlert && (
                    <AlertDialog
                        message={messageAlert}
                        onClose={handleCloseAlert}
                    />
                )}
            </div>
            {selectedItem && (
                <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
});

export default ItemBrowse;


