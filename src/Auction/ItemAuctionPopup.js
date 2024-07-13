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

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append("startingPrice", startingPrice);
        formData.append("isDonated", isDonated);

        await axios.post('/item/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setTitle('');
        setDescription('');
        setStartingPrice('');
        setImage(null);
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
                    <label htmlFor='StartingPrice'>Starting price:</label>
                    <input type='number' name="startingPrice" id='startingPrice' value = {startingPrice} onChange={(e)=> setStartingPrice(e.target.value)} required />
                    <h3>Donated:</h3>
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
                    <div>
                        Selected Option: {isDonated}
                    </div>
                    <button className="signin-button" type="submit">Submit</button>
                </form>
            </div>

        </div>
    )
};
export default ItemSellPopup;