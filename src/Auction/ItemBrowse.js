import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axios from 'axios';
import '../main.css';
import AlertDialog from '../AlertDialog/AlertDialog';

const ItemBrowse = forwardRef(({ onBidSubmit, filter, sortType, selectedCategories, selectedSizes }, ref) => {
    const [items, setItems] = useState([]);
    const [bidAmounts, setBidAmounts] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [loadingData, setLoadingData]= useState(true);
    const [errorData, setErrorData] = useState(null);

    const fetchItems = useCallback(async () => {
        try{
        const response = await axios.get('/item/items');
        let filteredItems = response.data
            .filter(item => {
                const currentDate = new Date();
                const auctionStartDate = new Date(item.auctionStart);
                const auctionEndDate = new Date(item.auctionEnd);
                return (currentDate > auctionStartDate && currentDate < auctionEndDate);
            })
            .filter(item => item.isDonated === filter);
            if (selectedCategories.length > 0) {
                filteredItems = filteredItems.filter(item =>  selectedCategories.includes(item.category.toLowerCase()));
            }

            console.log(selectedSizes);

            if (selectedSizes.length > 0) {
                filteredItems = filteredItems.filter(item => selectedSizes.includes(item.size.toLowerCase()));
            }


        handleSortChange(sortType, filteredItems);

        }catch(error){
            console.error(`Error fetching data`, error);
            setErrorData("Error fetching data");
        }finally {
            setLoadingData(false);
        }
    }, [filter, sortType, selectedCategories, selectedSizes]);

    const showTimer = (itemsList) => {
        return itemsList.map(item => {
            const now = new Date();
            const endTime = new Date(item.auctionEnd);
            const difference = endTime - now;
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                item.days = days;
                item.hours = hours;
                item.minutes = minutes;
            }
            return item;
        });
    };

    useEffect(() => {
        fetchItems();
    }, [filter, fetchItems, bidAmounts]);

    // useEffect(() => {
    //     if (sortType) {
    //         handleSortChange(sortType);
    //     }
    // }, [sortType]);

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
            setMessageAlert(`Please place a bid amount of atleast \u00A3${parseInt(minBidAmount) + 0.5}`);
            setBidAmounts({
                ...bidAmounts,
                [itemId]: ''
            });
            handleShowAlert();
            return;
        }
        if (!userId) {
            setMessageAlert("Please Signin first!");
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

    const sizeOrder = ["xs", "s", "m", "l", "xl", "n/a"];

    const handleSortChange = (sortType, itemsToSort = items) => {
        let sortedItems = [...itemsToSort];
        if (sortType === "byAuctionEnd") {
            sortedItems.sort((a, b) => new Date(a.auctionEnd) - new Date(b.auctionEnd));
        }  else if (sortType === "byCurrentBidHToL") {
            sortedItems.sort((a, b) => {
                const bidA = a.currentPrice || 0;
                const bidB = b.currentPrice || 0;
                if (bidA === 0 && bidB === 0) {
                    return parseFloat(b.startingPrice) - parseFloat(a.startingPrice);
                } else if (bidA === 0) {
                    return bidB - parseFloat(a.startingPrice);
                } else if (bidB === 0) {
                    return parseFloat(b.startingPrice) - bidA;
                } else {
                    return bidB - bidA;
                }
            });
        }  else if (sortType === "byCurrentBidLToH") {
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
        } else if (sortType === "bySize") {
            sortedItems.sort((a, b) => sizeOrder.indexOf(a.size.toLowerCase()) - sizeOrder.indexOf(b.size.toLowerCase()));
        }   
        setItems(sortedItems);
    };

    const sortedAndTimedItems = showTimer(items);
    const userId = localStorage.getItem("userId");


    if(loadingData)return <div>Loading...</div>;
    if(errorData)return <div>{errorData}</div>




    return (
        <div>
            <div id="imagesContainer">
                {sortedAndTimedItems.map(itemData => (
                    <div key={itemData.id} className="item-card">
                        <h3 className='timer'>{itemData.days}D:{itemData.hours}H:{itemData.minutes}M</h3>
                        <img src={`data:${itemData.type};base64,${itemData.image}`} alt={itemData.title} />
                        <p className='description' title={itemData.description}>
                            {itemData.description.length> 36? `${itemData.description.slice(0,36)}...`: itemData.description}</p>
                        <p>Size: {itemData.size}</p>
                        <div className='bids'>
                            <p>Starting price: &pound;{itemData.startingPrice}</p>
                            <p>Current Bid: &pound;{itemData.currentPrice ? itemData.currentPrice : itemData.startingPrice}</p>
                        </div>
                        <div className="inline-elements">
                            <label htmlFor={`bid-${itemData.id}`}>Bid:</label>
                            <input
                                type="number"
                                min={itemData.currentPrice ? itemData.currentPrice : itemData.startingPrice}
                                placeholder={`${itemData.user_id == userId ? ' 🛇' : `min. £${(itemData.currentPrice ? itemData.currentPrice : itemData.startingPrice) + 0.5}`}`}
                                id={`bid-${itemData.id}`}
                                name={`bid-${itemData.id}`}
                                value={bidAmounts[itemData.id] || ''}
                                onChange={(e) => handleBidChange(itemData.id, e.target.value)}
                                required
                                disabled ={itemData.user_id == userId}
                            />
                            <button type="button" onClick={() => handleBidSubmit(itemData.id)} disabled ={itemData.user_id == userId}>Go</button>
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
        </div>
    );
});

export default ItemBrowse;
