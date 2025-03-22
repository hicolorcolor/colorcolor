import React from 'react';
import { useLocation } from 'react-router-dom';
import { collections } from '../util/ColorOption';
import { Link } from 'react-router-dom';
import './LeftMenu.css';

import newbtn from '../assets/new.png';
import best from '../assets/best.png';
import reset from '../assets/reset.png';
import heart from '../assets/heart.png';
import { useFilter } from '../context/FilterContext';
function LeftMenu() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentType = queryParams.get('type');

    const { handleFilterChange } = useFilter();

    return (
        <div className="LeftMenu scrollBar">
            <div onClick={() => handleFilterChange('/')} className="LeftReset">
                <img src={reset} alt="reset버튼" />
                <span>Reset</span>
            </div>
            <ul className="tap">
                <li onClick={() => handleFilterChange('latest')}>
                    <img src={newbtn} alt="new버튼" />
                    <span>New</span>
                </li>
                <li onClick={() => handleFilterChange('favorite')}>
                    <img src={best} alt="best버튼" />
                    <span>Best</span>
                </li>
                <li onClick={() => handleFilterChange('userLike')}>
                    <img src={heart} alt="Favoritet버튼" />
                    <span>Favorite</span>
                </li>
            </ul>
            <div className="option">
                {collections.map((item, index) => (
                    <Link
                        key={index}
                        to={`/colors?type=${item}`}
                        className={`optionItem ${currentType === item ? 'on' : ''}`}
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default LeftMenu;
