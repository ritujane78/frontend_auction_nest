import React, { useState, useRef, useEffect } from 'react';
import ItemBrowse from '../Auction/ItemBrowse';
import ItemSellPopup from '../Auction/ItemAuctionPopup';
import SigninPopup from '../Signin/SigninPopup';
import AlertDialog from '../AlertDialog/AlertDialog';
import LogoutConfirmModal from '../LogoutConfirmModal/LogoutConfirmModal'; // Import the modal
import './home.css';
import { Link } from "react-router-dom";
import LogoComponent from '../Logo/LogoComponent';

function HomePage() {
    const [showSigninPopup, setShowSigninPopup] = useState(false);
    const [signinSuccess, setSigninSuccess] = useState(false);
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [sortType, setSortType] = useState('byAuctionEnd'); 

    const donatedItemBrowseRef = useRef();
    const otherItemBrowseRef = useRef();

    useEffect(() => {
        checkLoginStatus();
    }, []);

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
        if (donatedItemBrowseRef.current) {
            donatedItemBrowseRef.current.fetchItems();
        }
        if (otherItemBrowseRef.current) {
            otherItemBrowseRef.current.fetchItems();
        }
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

    return (
        <div className="App">
            <div className='button-container'>
                <LogoComponent />
                {signinSuccess ? (
                    <>
                        <div className='left-buttons'>
                            <Link id='clickText' to="/profile">Profile</Link>
                            <p id="clickText" onClick={handleSellClick}>Upload</p>
                        </div>
                        <p id='clickText' onClick={handleLogoutClick} style={{ marginLeft: 'auto', width: '8%'}}>Log out</p>
                    </>
                ) : (
                    <p id='clickText' onClick={handleSigninClick}>Sign in</p>
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
            <p className='sortBox'>Sort:
            <select onChange={handleSortChange} className="sort-select">
                <option value="byAuctionEnd">By Auction End Time</option>
                <option value="byCurrentBidHToL">By Current Bid (High to Low)</option>
                <option value="byCurrentBidLToH">By Current Bid (Low to High)</option>
                <option value="bySize">By Size</option>
                {/* <option value="byCategory">By Category</option> */}
            </select>
            </p>
            <p className='items-heading'>Donated Items</p>
            <ItemBrowse ref={donatedItemBrowseRef} onBidSubmit={handleBidSubmit} filter="true" sortType={sortType} />
            <p className='items-heading'>Others</p>
            <ItemBrowse ref={otherItemBrowseRef} onBidSubmit={handleBidSubmit} filter="false" sortType={sortType} />

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
