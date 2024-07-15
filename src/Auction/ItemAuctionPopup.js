import React, { useState } from 'react';
import axios from 'axios';
import './auction.css';
import '../popup.css'


const ItemSellPopup = ({show, onClose,  onItemSaved}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState(' ');
    const [isDonated, setIsDonated] = useState(' ');
    const [image, setImage] = useState(null);
    const [size, setSize] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [auctionMessage, setAuctionMessage] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append("startingPrice", startingPrice);
        formData.append("isDonated", isDonated);
        formData.append('size', size);
        formData.append('userId', localStorage.getItem('userId'));

        const response = await axios.post('/item/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if(response.status === 200){
            console.log(response.data.message);
            setAuctionMessage(response.data.message);
            alert('It  will take upto 2 days for auctioning to start and be shown at the Home Screen.')
        }
        setTitle('');
        setDescription('');
        setStartingPrice('');
        setImage(null);
        setSize('');
        setCurrentPrice('');
        setIsDonated('')
        setTimeout(()=> {
            setAuctionMessage('')
        }, 1000);

        if (onItemSaved) {
            onItemSaved();
        }
    };
    if (!show) {
        return null;
    }
    const handleOptionChange = (event) => {
        setIsDonated(event.target.value);
      };

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h1>Item</h1>
                <form onSubmit={handleUpload}>
                    <label htmlFor="image">Select image to upload:</label>
                    <input type="file" name="image" id="image" onChange={(e) => setImage(e.target.files[0])} required /><br />
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /><br />
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea><br />
                    
                    {/* <label htmlFor='currentPrice'>Current Price:</label>
                    <input type='number' step='0.01' name="currentPrice" id='currentPrice' value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} required /><br /> */}
                    
                    <p style={{marginTop : '0px'}}>Size:</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px' }}>
                            <input type="radio" name="size" value="XS" checked={size === 'XS'} onChange={handleSizeChange} />
                            XS
                        </label>
                        <label style={{ marginRight: '10px' }}>
                            <input type="radio" name="size" value="S" checked={size === 'S'} onChange={handleSizeChange} />
                            S
                        </label>
                        <label style={{ marginRight: '10px' }}>
                            <input type="radio" name="size" value="M" checked={size === 'M'} onChange={handleSizeChange} />
                            M
                        </label>
                        <label>
                            <input type="radio" name="size" value="L" checked={size === 'L'} onChange={handleSizeChange} />
                            L
                        </label>
                    </div>
                    <label htmlFor='StartingPrice'>Starting price:</label>
                    <input type='number' name="startingPrice" id='startingPrice' value = {startingPrice} onChange={(e)=> setStartingPrice(e.target.value)} required />
                    <p>Donated:</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>
                        <input type="radio" value="true" checked={isDonated === 'true'} onChange={handleOptionChange} />
                        True
                    </label>
                    <label>
                        <input type="radio" value="false" checked={isDonated === 'false'} onChange={handleOptionChange} />
                        False
                    </label>
                    </div>
                    {/* <div>
                        Selected Option: {isDonated}
                    </div> */}
                    <button className="signin-button" type="submit">Submit</button>
                </form>
                <div id="auctionMessage">{auctionMessage}</div>
            </div>

        </div>
    )
};
export default ItemSellPopup;