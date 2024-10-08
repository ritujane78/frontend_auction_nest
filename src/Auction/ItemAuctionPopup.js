import React, { useState, useEffect } from 'react';
import './auction.css';
import '../popup.css';

const ItemAuctionPopup = ({show, onClose,  onItemSaved}) => {
    const [brandName, setBrandName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [isDonated, setIsDonated] = useState('');
    const [image, setImage] = useState(null);
    const [size, setSize] = useState('');
    const [gender, setGender]= useState('');
    const [auctionMessage, setAuctionMessage] = useState('');
    const [today, setToday] = useState('');
    const [maxDate , setMaxDate] = useState('');
    const [auctionEndDate, setAuctionEndDate] = useState('');
    const [auctionEndTime, setAuctionEndTime] = useState('');
    const [auctionEnd, setAuctionEnd] = useState('');
    const [others, setOthers] = useState('');
    const [title, setTitle] = useState('');
    

    const minAuctionDate = () =>{
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setDate(futureDate.getDate() + 1);
        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0'); 
        const day = String(futureDate.getDate()).padStart(2, '0');
        setToday(`${year}-${month}-${day}`);
    }
    const maxAuctionDate = () =>{
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setDate(futureDate.getDate() + 30);
        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0'); 
        const day = String(futureDate.getDate()).padStart(2, '0');
        setMaxDate(`${year}-${month}-${day}`);
    }
    useEffect(() => {
        minAuctionDate();
        maxAuctionDate();
      }, []);


      const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brandName', brandName);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('image', image);
        formData.append("startingPrice", startingPrice);
        formData.append("isDonated", isDonated);
        formData.append('size', size);
        formData.append('gender', gender);
        formData.append('auctionEndDate', auctionEnd);
        formData.append('title', title);
        formData.append('userId', localStorage.getItem('userId'));


        try {
            const response = await fetch('/item/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (response.status === 200) {
                setAuctionMessage("Item Uploaded Successfully. Ready for auction.");
                setBrandName('');
                setCategory('');
                setDescription('');
                setStartingPrice('');
                setImage(null);
                setSize('');
                setGender('');
                setIsDonated('');
                setAuctionEnd('');
                setOthers(false);
                setTitle('');
                setAuctionEndDate('');
                setAuctionEndTime('');

                setTimeout(() => {
                    setAuctionMessage('');
                    if (onItemSaved) {
                        onItemSaved();
                    }
                }, 2000);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            setAuctionMessage(`Error saving the item: ${error.message}`);
        }
    };


    if (!show) {
        return null;
    }
    const handleCategoryChange = (event) => {
        if(event.target.value === "others"){
            setOthers(true);
        } else{
            setOthers(false);
        }
            setCategory(event.target.value);
        
    };
    const handleOthersCategoryChange = (event) => {
        setTitle(event.target.value);
    }
    const handleIsDonatedChange = (event) => {
        setIsDonated(event.target.value);
      };

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setAuctionEndDate(date);
        setAuctionEnd(combineDateTime(date, auctionEndTime));
    };

    const handleTimeChange = (e) => {
        const time = e.target.value;
        setAuctionEndTime(time);
        setAuctionEnd(combineDateTime(auctionEndDate, time));
    };

    const combineDateTime = (date, time) => {
        if (date && time) {
            return `${date}T${time}`;
        }
        return '';
    };

    const handleCloseClick = () => {
        setBrandName('');
        setCategory('');
        setDescription('');
        setStartingPrice('');
        setImage(null);
        setSize('');
        setGender('');
        setIsDonated('');    
        setAuctionMessage('');
        setOthers(false);
        setTitle('');
        setAuctionEndDate('');
        setAuctionEndTime('');
        onClose();
    }
    
    return (
        <div className="popup">
            <div className="auction-popup-content">
                <span className="close-btn" onClick={handleCloseClick}>&times;</span>
                <h2>Item</h2>
                <form className='signup-form' onSubmit={handleUpload}>
                    <label htmlFor="image">Select image to upload:</label>
                    <input type="file" name="image" id="image" onChange={(e) => setImage(e.target.files[0])} required />
                        <label htmlFor="categories">Category:</label>
                        <select id="categories" value={category} onChange={handleCategoryChange} required>
                            <option value="" disabled>Select an option</option>
                            <option value="tshirt">Tshirt</option>
                            <option value="pants">Pants</option>
                            <option value="skirt">Skirt</option>
                            <option value="dress">Dress</option>
                            <option value="jacket">Jacket</option>
                            <option value="sweater">Sweater</option>
                            <option value="others">Others</option>
                        </select>
                    {others && (
                        <>
                        <label htmlFor="brandName">Title:</label>
                        <input type='text' name='title' id='title' value={title} onChange={handleOthersCategoryChange} required />
                        </>
                    )}
                    <label htmlFor="brandName">Brand:</label>
                    <input type='text' name='brandName' id='brandName' value={brandName} onChange={(e) => setBrandName(e.target.value)} required />
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <p className="size-label">Size:</p>
                    <div className = "radio-buttons">
                        <label className= 'margin-r'>
                            <input type="radio" name="size" value="XS" checked={size === 'XS'} onChange={handleSizeChange} required/>
                            XS
                        </label>
                        <label className= 'margin-r'>
                            <input type="radio" name="size" value="S" checked={size === 'S'} onChange={handleSizeChange}required />
                            S
                        </label>
                        <label className= 'margin-r'>
                            <input type="radio" name="size" value="M" checked={size === 'M'} onChange={handleSizeChange} required/>
                            M
                        </label>
                        <label className= 'margin-r'>
                            <input type="radio" name="size" value="L" checked={size === 'L'} onChange={handleSizeChange} required/>
                            L
                        </label>
                        <label className= 'margin-r'>
                            <input type="radio" name="size" value="XL" checked={size === 'XL'} onChange={handleSizeChange} required/>
                            XL
                        </label>
                        <label>
                            <input type="radio" name="size" value="N/A" checked={size === 'N/A'} onChange={handleSizeChange}  required/>
                            N/A
                        </label>
                    </div>
                    <p>Gender:</p>
                    <div className='radio-buttons'>
                    <label className= 'margin-r'>
                        <input type="radio" value="m" name="genderOption" checked={gender === 'm'} onChange={handleGenderChange} required />
                        Male
                    </label>
                    <label className='margin-r'>
                        <input type="radio" value="f" name="genderOption" checked={gender === 'f'} onChange={handleGenderChange} required />
                        Female
                    </label>
                    <label>
                        <input type="radio" value="u" name="genderOption" checked={gender === 'u'} onChange={handleGenderChange} required />
                        Unisex
                    </label>
                    </div>
                    <label htmlFor='StartingPrice'>Starting price:</label>
                    <input type='number' name="startingPrice" id='startingPrice' value = {startingPrice} onChange={(e)=> setStartingPrice(e.target.value)} required />
                    <p>Donated:</p>
                    <div className='radio-buttons'>
                    <label className= 'margin-r'>
                        <input type="radio" value="true" name="isDonatedOption" checked={isDonated === 'true'} onChange={handleIsDonatedChange} required />
                        True
                    </label>
                    <label>
                        <input type="radio" value="false" name="isDonatedOption" checked={isDonated === 'false'} onChange={handleIsDonatedChange} required />
                        False
                    </label>
                    </div>
                    <label className='auction-end-label'>Auction End</label>
                    <div className="auction-end-container">
                        <div>
                            <label htmlFor='auctionEndDate'>Date:</label>
                            <input 
                                type='date' 
                                name="auctionEndDate" 
                                id='auctionEndDate' 
                                value={auctionEndDate} 
                                min={today} 
                                max={maxDate}  
                                onChange={handleDateChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor='auctionEndTime'>Time:</label>
                            <input 
                                type='time' 
                                name="auctionEndTime" 
                                id='auctionEndTime' 
                                value={auctionEndTime} 
                                onChange={handleTimeChange} 
                                required 
                            />
                        </div>
                    </div>
                    <br/>
                    <button className="signin-button" type="submit">Submit</button>
                    <div id="auction-message">{auctionMessage}</div>
                </form>
            </div>

        </div>
    )
};
export default ItemAuctionPopup;