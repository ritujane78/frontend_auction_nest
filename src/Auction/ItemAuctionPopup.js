import React, { useState } from 'react';
import axios from 'axios';
import './auction.css';
import '../popup.css';
import AlertDialog from '../AlertDialog/AlertDialog';


const ItemSellPopup = ({show, onClose,  onItemSaved}) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState(' ');
    const [isDonated, setIsDonated] = useState(' ');
    const [image, setImage] = useState(null);
    const [size, setSize] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [auctionMessage, setAuctionMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    const handleUpload = async (e) => {
        try {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category)
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
            setAuctionMessage("Item Uploaded Successfully. Ready for auction.");
                  }
        setTitle('');
        setCategory('');
        setDescription('');
        setStartingPrice('');
        setImage(null);
        setSize('');
        setCurrentPrice('');
        setIsDonated('')
        setTimeout(()=> {    
            setAuctionMessage('');
            if (onItemSaved) {
                onItemSaved();
            }
        }, 2000)


        } catch (error) {
            setAuctionMessage(` Error saving the item: ${error.response.data.error}`);
        }
        
    };
    if (!show) {
        return null;
    }
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };
    const handleIsDonatedChange = (event) => {
        setIsDonated(event.target.value);
      };

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };
    const handleCloseClick = () => {
        setTitle('');
        setDescription('');
        setStartingPrice('');
        setImage(null);
        setSize('');
        setCurrentPrice('');
        setIsDonated('');    
        setAuctionMessage('');
        onClose();
    }
    
  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-btn" onClick={handleCloseClick}>&times;</span>
                <h1>Item</h1>
                <form onSubmit={handleUpload}>
                    <label htmlFor="image">Select image to upload:</label>
                    <input type="file" name="image" id="image" onChange={(e) => setImage(e.target.files[0])} required /><br />
                        <label htmlFor="categories">Category:</label>
                        <select id="categories" value={category} onChange={handleCategoryChange} required>
                            <option value="" disabled>Select an option</option>
                            <option value="tshirt">Tshirt</option>
                            <option value="pants">Pants</option>
                            <option value="skirt">Skirt</option>
                            <option value="dress">Dress</option>
                            <option value="jacket">Jacket</option>
                            <option value="sweater">Sweater</option>
                            <option value="xothers">Others</option>
                        </select>
                    <label htmlFor="title">Title:</label>
                    <input type='text' name='title' id='title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea><br />
                    <p style={{marginTop : '0px'}}>Size:</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px' }}>
                            <input type="radio" name="size" value="XS" checked={size === 'XS'} onChange={handleSizeChange} required/>
                            XS
                        </label>
                        <label style={{ marginRight: '10px' }}>
                            <input type="radio" name="size" value="S" checked={size === 'S'} onChange={handleSizeChange}required />
                            S
                        </label>
                        <label style={{ marginRight: '10px' }}>
                            <input type="radio" name="size" value="M" checked={size === 'M'} onChange={handleSizeChange} required/>
                            M
                        </label>
                        <label style={{marginRight: '10px'}}>
                            <input type="radio" name="size" value="L" checked={size === 'L'} onChange={handleSizeChange} required/>
                            L
                        </label>
                        <label style={{marginRight: '10px'}}>
                            <input type="radio" name="size" value="XL" checked={size === 'XL'} onChange={handleSizeChange} required/>
                            XL
                        </label>
                        <label>
                            <input type="radio" name="size" value="N/A" checked={size === 'N/A'} onChange={handleSizeChange}  required/>
                            N/A
                        </label>
                    </div>
                    <label htmlFor='StartingPrice'>Starting price:</label>
                    <input type='number' name="startingPrice" id='startingPrice' value = {startingPrice} onChange={(e)=> setStartingPrice(e.target.value)} required />
                    <p>Donated:</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>
                        <input type="radio" value="true" name="isDonatedOption" checked={isDonated === 'true'} onChange={handleIsDonatedChange} required />
                        True
                    </label>
                    <label>
                        <input type="radio" value="false" name="isDonatedOption" checked={isDonated === 'false'} onChange={handleIsDonatedChange} required />
                        False
                    </label>
                    </div>
                    <button className="signin-button" type="submit">Submit</button>
                    <div id="auctionMessage">{auctionMessage}</div>
                </form>
                {showAlert && (
                    <AlertDialog 
                        message= {messageAlert}
                        onClose={handleCloseAlert} 
                    />
            )}
            </div>

        </div>
    )
};
export default ItemSellPopup;