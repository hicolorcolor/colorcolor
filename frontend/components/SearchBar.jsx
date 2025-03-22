import React from 'react';
import './SearchBar.css';
import searchImg from '../assets/search.png';

function SearchBar({ name, onClick, search, SetSearch }) {
    return (
        <div className="SearchBar" onClick={() => onClick(true)}>
            <img src={searchImg} alt="searchimg" />
            <input
                type="text"
                className="Customsearch Pretendard-r "
                placeholder={name}
                onChange={(e) => SetSearch(e.target.value)}
                value={search}
            />
        </div>
    );
}

export default SearchBar;
