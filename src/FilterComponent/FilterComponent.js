import React, { useEffect, useState } from 'react';
import './filter.css';

const FilterComponent = ({ categories, sizes, genderMap, selectedCategories, setSelectedCategories, selectedSizes, setSelectedSizes, selectedGender, setSelectedGender }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const filterSelected = selectedCategories.length + selectedSizes.length + selectedGender.length;
        const filterButton = document.querySelector('.filter-button');
        if (filterSelected > 0) {
            filterButton.textContent = `${filterSelected} selected`;
        } else {
            filterButton.textContent = 'Filter';
        }
    }, [selectedCategories, selectedSizes, selectedGender]);

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

    const handleGenderChange = (event) => {
        const { value, checked } = event.target;
        console.log(value);
        console.log(checked);
        setSelectedGender(prev =>
            checked ? [...prev, value] : prev.filter(gender => gender !== value)
        );
    };
    return (
        <div className="filter-dropdown">
            <button onClick={handleDropdownToggle} className="filter-button">Filter</button>
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
                    <div className="filter-section">
                        <h4>By Gender</h4>
                        {genderMap.map(gender => (
                            <label key={gender.key}>
                                <input
                                    type="checkbox"
                                    value={gender.key}
                                    checked={selectedGender.includes(gender.key)}
                                    onChange={handleGenderChange}
                                />
                                {gender.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;
