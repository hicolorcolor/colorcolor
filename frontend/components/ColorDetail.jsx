import './ColorDetail.css'; // ✅ 스타일 추가
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchColorById } from '../api/fetchColor';
import Layout from '../page/Layout';
import { useUser } from '../context/UserIdContext';
import { useFilter } from '../context/FilterContext';
import { getRelativeTime } from '../util/DateFormat';
import { handleCopy } from '../util/CopyColor'; // 컬러값 복사 함수
import { handleLikeToggle } from '../util/LikeUpdate'; // 좋아요 함수
import { MediaQueryContext } from '../context/MediaQueryContext';

import sheart from '../assets/sheart.png';
import fillheart from '../assets/fill_sheart.png';
import share from '../assets/share.png';

const ColorDetail = () => {
    const {
        filteredColors, // ✅ Context에서 가져오기
        sortType,
        colors,
        allColors,
        setFilteredColors,
        isClick,
        setIsClick,
        handleOptionOpen,
        handleFilterChange,
    } = useFilter();

    const { likedItems, userId, setLikedItems } = useUser();
    const { id } = useParams();
    const navigate = useNavigate();
    const [colorData, setColorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedHex, setCopiedHex] = useState(null);
    const [copiedRgb, setCopiedRgb] = useState(null);

    const [copyUrl, setCopyUrl] = useState('Link');
    const URLCOPY = `https://colorcolor.vercel.app/color/${id}`;

    const { isMobile } = useContext(MediaQueryContext);

    // 태그 클릭 시 해당 타입을 URL에 추가하여 ColorList 페이지로 이동
    const handleTagClick = (type) => {
        navigate(`/colors?type=${type}`); // ✅ 클릭하면 해당 타입으로 필터링된 페이지로 이동
    };
    // 태그 클릭 시 해당 타입을 URL에 추가하여 ColorList 페이지로 이동
    const handleColorOptionClick = (colorOption) => {
        navigate(`/colors?color=${colorOption}`); // ✅ 클릭하면 해당 타입으로 필터링된 페이지로 이동
    };
    const handleColorClick = (color) => {
        navigate(`/colors?color=${color.name}`); // ✅ 컬러 필터 적용
    };
    useEffect(() => {
        const loadColorData = async () => {
            const data = await fetchColorById(id);
            setColorData(data);
            setLoading(false);
        };

        loadColorData();
    }, [id]);

    if (!colorData) return console.log('loading');

    return (
        <Layout
            colors={colors}
            likedItems={likedItems}
            filteredColors={filteredColors}
            sortType={sortType}
            allColors={allColors}
            isClick={isClick}
            handleOptionOpen={handleOptionOpen}
        >
            <div className="color-detail-container">
                <div className="palette-preview">
                    {colorData.colors.map((color, index) => (
                        <div key={index} className="palette-color" style={{ backgroundColor: color.hex }}></div>
                    ))}
                </div>

                <div className="palette-actions">
                    <button
                        className="like-btn"
                        onClick={(event) =>
                            handleLikeToggle(event, colorData.id, setFilteredColors, setLikedItems, likedItems, userId)
                        }
                    >
                        {likedItems.has(colorData.id) ? (
                            <img src={fillheart} alt="빈하트" />
                        ) : (
                            <img src={sheart} alt="꽉찬하트" />
                        )}
                        <span>{likedItems.has(colorData.id) ? colorData.favorite + 1 : colorData.favorite}</span>
                    </button>
                    <button className="action-btn">
                        <img src={share} alt="공유하기이미지" />
                        <span
                            onClick={(e) => {
                                handleCopy(e, URLCOPY); // 항상 진짜 URL을 복사
                                setCopyUrl('Copied!'); // UI 텍스트만 바꿔줌

                                setTimeout(() => {
                                    setCopyUrl('Link');
                                }, 1500);
                            }}
                        >
                            {copyUrl}
                        </span>
                    </button>
                    <span className="time">
                        <span>{getRelativeTime(colorData.date)}</span>
                    </span>
                </div>

                <div className="color-info">
                    {colorData.colors.map((color, index) => (
                        <div key={index} className="color-info-item">
                            <div className="color-circle" style={{ backgroundColor: color.hex }}></div>

                            <div className="color-text">
                                <p className="hex" onClick={(e) => handleCopy(e, color.hex, () => setCopiedHex(index))}>
                                    {copiedHex === index ? 'Copied!' : color.hex}
                                </p>

                                <p className="rgb" onClick={(e) => handleCopy(e, color.rgb, () => setCopiedRgb(index))}>
                                    {copiedRgb === index ? 'Copied!' : color.rgb}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 📌 태그 (카테고리) */}
                <div className="tags">
                    {colorData.types.map((type, index) => (
                        <span onClick={() => handleTagClick(type)} key={index} className="tag">
                            {type}
                        </span>
                    ))}
                    {colorData.colorOption.map((colorOption, index) => (
                        <span onClick={() => handleColorOptionClick(colorOption.name)} key={index} className="tag">
                            <em style={{ backgroundColor: colorOption.hex }}></em>
                            {colorOption.name}
                        </span>
                    ))}
                </div>

                <div className="recommend Pretendard-b">
                    Recommend <span onClick={() => handleFilterChange('/latest')}>New</span> Colors
                </div>
                <div className="palette-container">
                    <div className="palette-grid">
                        {colors.length > 0 ? (
                            colors.map((palette, index) => (
                                <Link
                                    to={`/color/${palette.id}`}
                                    key={`${palette.id}-${index}`}
                                    style={{ textDecoration: 'none' }}
                                >
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
                                    <div className="palette-info">
                                        <div
                                            className="palette-types"
                                            onClick={(event) =>
                                                handleLikeToggle(
                                                    event,
                                                    palette.id,
                                                    setFilteredColors,
                                                    setLikedItems,
                                                    likedItems,
                                                    userId
                                                )
                                            }
                                        >
                                            <span>
                                                {likedItems.has(palette.id) ? (
                                                    <img src={fillheart} alt="빈하트" />
                                                ) : (
                                                    <img src={sheart} alt="꽉찬하트" />
                                                )}
                                                {/* {palette.favorite} */}
                                                {likedItems.has(palette.id) ? palette.favorite + 1 : palette.favorite}
                                            </span>
                                        </div>
                                        <div className="palette-date">
                                            <span>{getRelativeTime(palette.date)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="no-results">검색 결과가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ColorDetail;
