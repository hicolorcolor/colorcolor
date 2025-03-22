import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collections, colorChip } from '../util/ColorOption';
import { MediaQueryContext } from '../context/MediaQueryContext';

import './ColorFilter.css';
import close from '../assets/close.png';
import reset from '../assets/reset.png';

const ColorFilter = ({ isClick, search, onClick, handleFilterChange }) => {
    const { isMobile } = useContext(MediaQueryContext);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentType = queryParams.get('type');
    const currentColor = queryParams.get('color');
    const safeSearch = search?.toLowerCase() || ''; // ✅ `search`가 없으면 빈 문자열로 설정

    const handleTypeClick = (type) => {
        navigate(`/colors?type=${type}`); // ✅ 필터 변경 시 URL 업데이트
    };

    const handleColorClick = (color) => {
        navigate(`/colors?color=${color.name}`); // ✅ 컬러 필터 적용
    };

    const filteredColorChip = colorChip.filter((color) => color?.name?.toLowerCase().includes(safeSearch));

    const filteredCollectionsChip = collections.filter((color) => color?.toLowerCase().includes(safeSearch));

    return (
        <div className={`filter-container ${isMobile ? 'scrollBar' : ''} ${isClick ? 'on' : ''}`}>
            <div className="closeBtn" onClick={() => onClick(false)}>
                <img src={close} alt="닫기버튼" />
            </div>
            <h3>Colors</h3>
            <div className="filter-list">
                {filteredColorChip.length > 0 ? (
                    filteredColorChip.map((color) => (
                        <button
                            key={color.name}
                            className={`filter-item ${currentColor === color.name ? 'active' : ''}`}
                            onClick={() => handleColorClick(color)}
                        >
                            <span className="color-dot" style={{ backgroundColor: color.hex }}></span>
                            {color.name}
                        </button>
                    ))
                ) : (
                    <p className="no-results">검색 결과가 없습니다.</p>
                )}
            </div>
            <h3>Collections</h3>
            <div className="filter-list">
                {filteredCollectionsChip.length > 0 ? (
                    filteredCollectionsChip.map((collection) => (
                        <button
                            key={collection}
                            className={`filter-item ${currentType === collection ? 'active' : ''}`}
                            onClick={() => handleTypeClick(collection)}
                        >
                            {collection}
                        </button>
                    ))
                ) : (
                    <p className="no-results">검색 결과가 없습니다.</p>
                )}
            </div>

            <button className="Reset" onClick={() => handleFilterChange('/')}>
                <span>Reset</span>
                <img src={reset} alt="reset버튼" />
            </button>
        </div>
    );
};

export default ColorFilter;
