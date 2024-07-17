import React, { useState, useRef, useEffect } from 'react';
import ItemBrowse from '../Auction/ItemBrowse';
import ItemSellPopup from '../Auction/ItemAuctionPopup';
import SigninPopup from '../Signin/SigninPopup';
import AlertDialog from '../AlertDialog/AlertDialog';
import './home.css';
import { Link , useNavigate} from "react-router-dom";

function HomePage() {
    const [showSigninPopup, setShowSigninPopup] = useState(false);
    const [signinSuccess, setSigninSuccess] = useState(false);
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    const itemBrowseRef = useRef();
    const navigate = useNavigate();


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
                setMessageAlert("Bid Placed Successfully!")
                handleShowAlert();
                // alert('Bid placed successfully!');
                return true;
            }
                setMessageAlert("Failed to Place Bid.")
                handleShowAlert();
                // alert('Failed to place bid.');
                return false;
        } catch (error) {
            console.error('Error Placing Bid:', error);
            setMessageAlert("Error Placing Bid.")
            handleShowAlert();
            return false;
        }
    };

    const handleItemSaved = () => {
        if (itemBrowseRef.current) {
            itemBrowseRef.current.fetchItems();
        }
        setShowSellPopup(false);
    };
    const handleLogoutClick = () =>{
        
        const userConfirmed = window.confirm("Are you sure you want to log out?");
        if(userConfirmed){
            localStorage.removeItem('expirationTime');
            localStorage.removeItem('userId');
            setSigninSuccess(false);
        }
        
    }
    const handleShowAlert = () => {
        setShowAlert(true);
      };
    
      const handleCloseAlert = () => {
        setShowAlert(false);
      };

    return (
        <div className="App">
           <div className='button-container'>
                {signinSuccess ? (
                    <>
                        <div className="left-buttons">
                            <Link id='clickText' to="/profile">Profile</Link>
                            <p id="clickText" onClick={handleSellClick}>Upload</p>
                        </div>
                        <p id='clickText' onClick={handleLogoutClick} style={{ marginLeft: 'auto' }}>Log out</p>
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
            <p className='items-heading'>Donated Items</p>
            <ItemBrowse ref={itemBrowseRef} onBidSubmit={handleBidSubmit} filter="true" />
            <p className='items-heading'>Others</p>
            <ItemBrowse ref={itemBrowseRef} onBidSubmit={handleBidSubmit} filter="false" />
            
            {showAlert && (
                    <AlertDialog 
                        message= {messageAlert}
                        onClose={handleCloseAlert} 
                    />
                 )}
        </div>
    );
}

export default HomePage;
