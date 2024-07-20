import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import './profile.css';
import LogoComponent from "../Logo/LogoComponent";

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userBids, setUserBids] = useState({});
    const [userWins, setUserWins] = useState({});
    const [userUploads, setUserUploads] = useState({})
    const [loading, setLoading] = useState({ profile: true, uploads: true, bids: true, wins: true });
    const [error, setError] = useState({ profile: null, uploads: null, bids: null, wins: null });

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    if (!userId) {
        navigate('/');
    }

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
        fetchData(`/profile/user/${userId}/uploads`, setUserUploads, setError, 'uploads'); 
        fetchData(`/profile/user/${userId}/bids`, setUserBids, setError, 'bids');
        fetchData(`/profile/user/${userId}/wins`, setUserWins, setError, 'wins');
    }, [fetchData, userId]);
    const handleLogoutClick = () => {
        const userConfirmed = window.confirm("Are you sure you want to log out?");
        if (userConfirmed) {
            localStorage.removeItem('expirationTime');
            localStorage.removeItem('userId');
            navigate("/");
        }

    }


    if (loading.profile || loading.bids || loading.uploads || loading.wins) return <div>Loading...</div>;
    if (error.profile) return <div>{error.profile}</div>;
    if (error.uploads) return <div>{error.uploads}</div>
    if (error.bids) return <div>{error.bids}</div>;
    if (error.wins) return <div>{error.wins}</div>;

    return (
        <div className="profile-container">
            <div className='button-container'>
                <LogoComponent />
                <p id='clickText' onClick={handleLogoutClick} style={{ marginLeft: 'auto', width: '7%' }}>Log out</p>
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

            <h2 className='items-heading'>Uploads</h2> {/* Add this section for uploads */}
            <div className="uploads-container">
                {userUploads.length > 0 ? (
                    userUploads.map(upload => (
                        <div className="upload-item" key={upload.item_id}>
                            <img className="upload-image" src={`data:${upload.image_type};base64,${upload.image}`} alt={`Item ${upload.item_id}`} />
                            <div className="upload-details">
                                <p>{upload.category}</p>
                                {/* <p>Description: {upload.description}</p> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No uploads,yet.</div>
                )}
            </div>

            <h2 className='items-heading'>Bids</h2>
            <div className="bids-container">
                {Object.keys(userBids).length > 0 ? (
                    Object.keys(userBids).map(itemId => (
                        <div className="bid-item" key={itemId}>
                            <img className="bid-image" src={`data:${userBids[itemId].itemDetails.image_type};base64,${userBids[itemId].itemDetails.image}`} alt={`Item ${itemId}`} />
                            <div className="bid-amounts">
                                {userBids[itemId].bids.map((bid, index) => (
                                    <span key={bid.bid_id}>
                                        &pound;{bid.bid_amount}{index < userBids[itemId].bids.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No bids, yet.</div>
                )}
            </div>

            <h2 className='items-heading'>Wins</h2>
            <div className="bids-container">
                {Object.keys(userWins).length > 0 ? (
                    Object.keys(userWins).map(itemId => (
                        <div className="bid-item" key={itemId}>
                            <img className="bid-image" src={`data:${userWins[itemId].itemDetails.image_type};base64,${userWins[itemId].itemDetails.image}`} alt={`Item ${itemId}`} />
                            <div className="bid-amounts">
                                {userWins[itemId].bids.map((win, index) => (
                                    <span key={win.bid_id}>
                                        &pound;{win.bid_amount}{index < userWins[itemId].bids.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No wins, yet.</div>
                )}
            </div>
            {/* <Link to="/">Go to Home</Link> */}
        </div>
    );
};

export default ProfilePage;
