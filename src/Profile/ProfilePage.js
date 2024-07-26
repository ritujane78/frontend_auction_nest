import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './profile.css';
import LogoComponent from "../Logo/LogoComponent";
import { formatDate } from "../utils";
import LogoutConfirmModal from "../LogoutConfirmModal/LogoutConfirmModal";

const ProfilePage = () => {
    const location = useLocation();
    const { items } = location.state || { items: [] };
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [userWins, setUserWins] = useState([]);
    const [userUploads, setUserUploads] = useState([]);
    const [sortedBids, setSortedBids] = useState([]);
    const [loading, setLoading] = useState({ profile: true, uploads: true, bids: true, wins: true });
    const [error, setError] = useState({ profile: null, uploads: null, bids: null, wins: null });

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const fetchUploadsData = () => {
        if (!userId) {
            navigate('/');
        }

        try {
            const uploads = items.filter(item => item.user_id == userId);
            setUserUploads(uploads.sort((a, b) => new Date(b.auctionEnd) - new Date(a.auctionEnd)));
        } catch (err) {
            setError(prev => ({ ...prev, uploads: "Error fetching data" }));
        } finally {
            setLoading(prev => ({ ...prev, uploads: false }));
        }
    };

    const fetchWinsData = () => {
        if (!userId) {
            navigate('/');
        }

        try {
            const wins = items.filter(item => item.winner_id == userId);
            setUserWins(wins);
        } catch (err) {
            setError(prev => ({ ...prev, wins: "Error fetching data" }));
        } finally {
            setLoading(prev => ({ ...prev, wins: false }));
        }
    };

    const fetchData = useCallback(async (url, setter, errorSetter, loadingKey) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            errorSetter(prev => ({ ...prev, [loadingKey]: `Error fetching data` }));
        } finally {
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
        }
    }, []);

    useEffect(() => {
        fetchData(`/profile/user/${userId}`, setUserProfile, setError, 'profile');
        fetchUploadsData();
        fetchData(`/profile/user/${userId}/bids`, (data) => {
            const sortedBidsArray = Object.entries(data)
                .sort(([, a], [, b]) => new Date(b.auctionEnd) - new Date(a.auctionEnd));
            setSortedBids(sortedBidsArray);
        }, setError, 'bids');
        fetchWinsData();
    }, [fetchData, userId]);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('userId');
        setShowLogoutConfirm(false);
        navigate("/");
    };

    const handleCloseLogoutConfirm = () => {
        setShowLogoutConfirm(false);
    };

    if (loading.profile || loading.bids || loading.uploads || loading.wins) return <div>Loading...</div>;
    if (error.profile) return <div>{error.profile}</div>;
    if (error.uploads) return <div>{error.uploads}</div>;
    if (error.bids) return <div>{error.bids}</div>;
    if (error.wins) return <div>{error.wins}</div>;

    return (
        <div className="profile-container">
            <div className='button-container'>
                <LogoComponent />
                <p id='clickText' onClick={handleLogoutClick} style={{ marginLeft: 'auto', width: '5%' }}>Log out</p>
            </div>
            {userProfile ? (
                <div className="profile-details">
                    <h1>{userProfile.name}</h1>
                    <p>Username: {userProfile.username}</p>
                    <p>Email address: {userProfile.email}</p>
                    <p>Home Address: {userProfile.address}</p>
                    <p>Phone Number: {userProfile.phone}</p>
                </div>
            ) : (
                <div>No profile data found</div>
            )}

            <h2 className='items-heading'>Uploads</h2>
            <div className="uploads-container">
                {userUploads.length > 0 ? (
                    userUploads.map(upload => (
                        <div className="upload-item" key={`upload_${upload.id}`}>
                            <div className="image-container">
                                <img className="upload-image" src={`data:${upload.image_type};base64,${upload.image}`} alt={`Item ${upload.item_id}`} />
                                {upload.isDonated === "true" && <span className="donated-tag">DONATED</span>}
                            </div>
                            <div className="upload-details">
                                <p className="auction-tag">auction end date</p>
                                <p>{formatDate(upload.auctionEnd)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No uploads, yet.</div>
                )}
            </div>

            <h2 className='items-heading'>Bids</h2>
            <div className="bids-container">
                {sortedBids.length > 0 ? (
                    sortedBids.map(([itemId, bidData]) => {
                        const sortedBidAmounts = bidData.bids.length > 1 ? bidData.bids.sort((a, b) => b.bid_amount - a.bid_amount) : bidData.bids;
                        const bidAmounts = sortedBidAmounts.map((bid, index) => `£${bid.bid_amount}`).join(', ');
                        const truncatedBidAmounts = bidAmounts.length > 15 ? `${bidAmounts.slice(0, 15)}...` : bidAmounts;

                        return (
                            <div className="bid-item" key={`bid_${itemId}`}>
                                <div className="image-container">
                                    <img className="bid-image" src={`data:${bidData.itemDetails.image_type};base64,${bidData.itemDetails.image}`} alt={`Item ${itemId}`} />
                                </div>
                                <div className="bid-details">
                                    <div className="bid-amounts" title={bidAmounts}>
                                        {truncatedBidAmounts}
                                    </div>
                                    <p className="auction-tag">auction end date</p>
                                    <p>{formatDate(bidData.auctionEnd)}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>No bids, yet.</div>
                )}
            </div>

            <h2 className='items-heading'>Wins</h2>
            <div className="wins-container">
                {userWins.length > 0 ? (
                    userWins.map(win => (
                        <div className="win-item" key={`win_${win.id}`}>
                            <img className="win-image" src={`data:${win.image_type};base64,${win.image}`} alt={`Item ${win.item_id}`} />
                            <div className="win-amounts">
                                &pound;{win.final_price}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No wins, yet.</div>
                )}
            </div>
            <LogoutConfirmModal
                show={showLogoutConfirm}
                onClose={handleCloseLogoutConfirm}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};

export default ProfilePage;
