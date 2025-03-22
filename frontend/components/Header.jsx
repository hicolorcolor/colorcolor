import React, { useContext, useState } from 'react';
import SearchBar from './SearchBar';
import ColorFilter from './ColorFilter';
import MarqueeLogo from './MarqueeLogo';
import onimg from '../assets/ton.png';
import offimg from '../assets/toff.png';

import app from '../assets/app.png';
import close from '../assets/close.png';

import { useFilter } from '../context/FilterContext';
import { LayerContext } from '../context/LayerContext';

import './Header.css';

function Header({ name, handleOptionOpen, SetSearch, search, isClick }) {
    const { dark, setDark } = useContext(LayerContext);

    const { handleFilterChange } = useFilter();

    const [on, setOn] = useState(false);

    const handleOn = () => {
        setOn((prev) => !prev);
    };

    const handleToggleDarkMode = () => {
        setDark((prev) => !prev);
    };

    const imgOver = <img src={on ? close : app} alt="Toggle Icon" />;
    const darkBtn = <img src={dark ? onimg : offimg} alt="Dark Icon" />;

    return (
        <div className="Header">
            <ul>
                <li className="logo" onClick={() => handleFilterChange('/')}>
                    <MarqueeLogo />
                    <span className="PoiretOne">colorcolor</span>
                </li>
                <SearchBar name={name} onClick={handleOptionOpen} SetSearch={SetSearch} search={search} />
                <li
                    onClick={() => {
                        handleOn();
                    }}
                    className="HeaderRight"
                >
                    {imgOver}
                </li>
            </ul>
            <div className="menu" style={{ display: on ? 'block' : 'none' }}>
                <ul>
                    <li className="PoiretOne" onClick={() => handleFilterChange('/')}>
                        <span>colorcolor</span> <MarqueeLogo />
                    </li>
                    <li onClick={() => handleFilterChange('latest')}>New</li>
                    <li onClick={() => handleFilterChange('favorite')}>Best</li>
                    <li onClick={() => handleFilterChange('userLike')}>Favorite</li>
                    <li
                        className="dark"
                        onClick={() => {
                            handleToggleDarkMode();
                        }}
                    >
                        {dark ? 'Dark Mode' : 'Light Mode'}
                        {darkBtn}
                    </li>
                    <li>
                        <a href="https://newprofile-jade.vercel.app/" target="_blank" rel="noopener noreferrer">
                            WHO WE ARE
                        </a>
                    </li>
                </ul>
            </div>
            <ColorFilter
                isClick={isClick}
                search={search}
                onClick={handleOptionOpen}
                handleFilterChange={handleFilterChange}
            />
        </div>
    );
}

export default Header;
