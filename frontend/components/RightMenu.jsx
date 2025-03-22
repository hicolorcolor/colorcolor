import React, { useContext, useEffect, useState } from 'react';
import { handleCopy } from '../util/CopyColor'; // 컬러값 복사 함수
import { Link } from 'react-router-dom';
import { MediaQueryContext } from '../context/MediaQueryContext';
import './RightMenu.css';

function RightMenu({ allColors, filteredColors, likedItems, sortType }) {
    const [copyEmail, setCopyEmail] = useState('hi.furyproject@gmail.com');
    const likedColors = allColors.filter((palette) => likedItems.has(palette.id));

    const { isMobile } = useContext(MediaQueryContext);

    return (
        <div className="RightMenu" style={{ display: isMobile ? 'none' : 'block ' }}>
            <ul className="InfoWrap">
                <li>Contact Us</li>
                <li>Please contact us email</li>

                <li
                    className="emailClick"
                    onClick={(e) => {
                        handleCopy(e, copyEmail, copyEmail);
                        setCopyEmail('Copyed!');

                        setTimeout(() => {
                            setCopyEmail('hi.furyproject@gmail.com');
                        }, 1500);
                    }}
                >
                    {copyEmail}
                </li>
            </ul>
            {sortType !== 'userLike' && (
                <div className="favoriteWrap">
                    <div className="name">{likedColors.length} Favorites</div>
                    <div className="desc">Expert in color harmony</div>
                    <div className="likedColorWrap scrollBar">
                        {likedColors.length > 0 ? (
                            likedColors.map((palette) => (
                                <Link to={`/color/${palette.id}`} key={palette.id} style={{ textDecoration: 'none' }}>
                                    <div className="palette-card">
                                        <div className="palette-colors">
                                            {palette.colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="palette-color"
                                                    style={{ backgroundColor: color.hex }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>컬러조합을 좋아요 눌러보세요.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RightMenu;
