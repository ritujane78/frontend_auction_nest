import React, { useState, useRef, useEffect } from 'react';
import ItemBrowse from '../Auction/ItemBrowse';
import ItemSellPopup from '../Auction/ItemAuctionPopup';
import SigninPopup from '../Signin/SigninPopup';
import AlertDialog from '../AlertDialog/AlertDialog';
import Notification from '../NotificationsComponent/NotificationsComponent';
import LogoutConfirmModal from '../LogoutConfirmModal/LogoutConfirmModal'; // Import the modal
import { Link } from "react-router-dom";
import LogoComponent from '../LogoComponent/LogoComponent';
import FilterComponent from '../FilterComponent/FilterComponent';  // Import the FilterComponent
import './home.css';

function HomePage() {
    const [showSigninPopup, setShowSigninPopup] = useState(false);
    const [signinSuccess, setSigninSuccess] = useState(false);
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [sortType, setSortType] = useState('byAuctionEnd'); 
    const [items, setItems] = useState([]);
    const [donatedItems, setDonatedItems] = useState([]);
    const [otherItems, setOtherItems] = useState([]);
    const [bidAmounts, setBidAmounts] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false); // New state for showing notifications

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const categories = ["pants", "tshirt", "dress", "skirt", "jacket", "others"];
    const sizes = ["xs", "s", "m", "l", "xl", "n/a"];

    const donatedItemBrowseRef = useRef();
    const otherItemBrowseRef = useRef();

    useEffect(() => {
        checkLoginStatus();
        fetchItems();
    }, []);

    useEffect(() => {
        filterItems();
    }, [items, selectedCategories, selectedSizes]);

    useEffect(() => {
        fetchItems();
    }, [bidAmounts]);

    const checkLoginStatus = () => {
        const expirationTime = localStorage.getItem('expirationTime');
        const currentTime = new Date().getTime();

        if (expirationTime && currentTime < expirationTime) {
            setSigninSuccess(true);
        } else {
            localStorage.removeItem('userId');
            localStorage.removeItem('expirationTime');
            setSigninSuccess(false);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('/item/items', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            setItems(data);
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching items:', error);
            setMessageAlert('Error fetching items.');
            setShowAlert(true);
        }
    };

    const filterItems = () => {
        let filtered = items;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(item => selectedCategories.includes(item.category.toLowerCase()));
        }

        if (selectedSizes.length > 0) {
            filtered = filtered.filter(item => selectedSizes.includes(item.size.toLowerCase()));
        }
        filtered = filtered
            .filter(item => {
                const currentDate = new Date();
                const auctionEndDate = new Date(item.auctionEnd);
                return (currentDate < auctionEndDate);
            });
        setDonatedItems(filtered.filter(item => item.isDonated === "true"));
        setOtherItems(filtered.filter(item => item.isDonated === "false"));
    };

    const handleSigninClick = () => {
        setShowSigninPopup(true);
    };

    const handleSellClick = () => {
        setShowSellPopup(true);
    };

    const handleSellClosePopup = () => {
        setShowSellPopup(false);
    };

    const handleSigninClosePopup = () => {
        setShowSigninPopup(false);
    };

    const handleSigninSuccess = () => {
        setSigninSuccess(true);
        setShowSigninPopup(false);
    };

    const handleBidSubmit = async (item_id, bidAmount) => {
        const user_id = parseInt(localStorage.getItem('userId'));

        try {
            const response = await fetch('/bid/saveBid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: item_id,
                    user_id: user_id,
                    bid_amount: bidAmount,
                }),
            });

            if (response.ok) {
                setMessageAlert("Bid Placed Successfully!");
                handleShowAlert();
                setBidAmounts({
                    ...bidAmounts,
                    [item_id]: bidAmount
                });
                return true;
            }
            setMessageAlert("Failed to Place Bid.");
            handleShowAlert();
            return false;
        } catch (error) {
            console.error('Error Placing Bid:', error);
            setMessageAlert("Error Placing Bid.");
            handleShowAlert();
            return false;
        }
    };

    const handleItemSaved = () => {
        fetchItems();
        setShowSellPopup(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('userId');
        setSigninSuccess(false);
        setShowLogoutConfirm(false); 
    };

    const handleCloseLogoutConfirm = () => {
        setShowLogoutConfirm(false); 
    };

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleSortChange = (event) => {
        setSortType(event.target.value);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="App">
            <div className='button-container'>
                <LogoComponent />
                {signinSuccess ? (
                    <>
                        <div className='left-buttons'>
                            <Link id='click-text' to="/profile" state={{items}}>Profile</Link>
                            <p id="click-text" onClick={handleSellClick}>Upload</p>
                        </div>
                        <div className='right-buttons'>
                            <div className='notification-container'>
                                <img 
                                    id='notification-bell' 
                                    src='images/bell.png'
                                    alt='Notifications' 
                                    onClick={toggleNotifications}
                                />
                                {showNotifications && <Notification id='clickText' items={notifications} />}
                            </div>
                            <p id='click-text' onClick={handleLogoutClick}>Log out</p>
                        </div>
                    </>
                ) : (
                    <p id='click-text' onClick={handleSigninClick}>Sign in</p>
                )}
            </div>
            <ItemSellPopup
                show={showSellPopup}
                onClose={handleSellClosePopup}
                onItemSaved={handleItemSaved}
            />
            <SigninPopup
                show={showSigninPopup}
                onClose={handleSigninClosePopup}
                onSuccess={handleSigninSuccess}
            />
            <div className='selection-container'>
                <FilterComponent
                    categories={categories}
                    sizes={sizes}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedSizes={selectedSizes}
                    setSelectedSizes={setSelectedSizes}
                />
                <div className='sort-select'>
                    <select onChange={handleSortChange}>
                        <option value="byAuctionEnd">By Auction End Time</option>
                        <option value="byCurrentBidHToL">By Current Bid (H to L)</option>
                        <option value="byCurrentBidLToH">By Current Bid (L to H)</option>
                        <option value="bySize">By Size</option>
                    </select>
                </div>
            </div>
            <p className='items-heading'>Donated Items</p>
            <ItemBrowse ref={donatedItemBrowseRef} onBidSubmit={handleBidSubmit} sortType={sortType} items={donatedItems} bidAmounts={bidAmounts} setBidAmounts={setBidAmounts} />
            <p className='items-heading'>Others</p>
            <ItemBrowse ref={otherItemBrowseRef} onBidSubmit={handleBidSubmit} sortType={sortType} items={otherItems} bidAmounts={bidAmounts} setBidAmounts={setBidAmounts} />

            {showAlert && (
                <AlertDialog
                    message={messageAlert}
                    onClose={handleCloseAlert}
                />
            )}
            <LogoutConfirmModal
                show={showLogoutConfirm}
                onClose={handleCloseLogoutConfirm}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
}

export default HomePage;
