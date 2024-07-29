import React, { useState } from 'react';
import './filter.css';

const FilterComponent = ({ categories, sizes, selectedCategories, setSelectedCategories, selectedSizes, setSelectedSizes }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(category => category !== value)
        );
    };

    const handleSizeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedSizes(prev =>
            checked ? [...prev, value] : prev.filter(size => size !== value)
        );
    };

    return (
        <div className="filter-dropdown">
            <button onClick={handleDropdownToggle} className="filter-button">Filter None</button>
            {dropdownVisible && (
                <div className="filter-menu">
                    <div className="filter-section">
                        <h4>By Category</h4>
                        {categories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={handleCategoryChange}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                    <div className="filter-section">
                        <h4>By Size</h4>
                        {sizes.map(size => (
                            <label key={size}>
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={selectedSizes.includes(size)}
                                    onChange={handleSizeChange}
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;
