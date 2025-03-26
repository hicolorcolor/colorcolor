import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { handleCopy } from '../util/CopyColor'; // 컬러값 복사 함수
import { getRelativeTime } from '../util/DateFormat'; // 컬러값 복사 함수
import { handleLikeToggle } from '../util/LikeUpdate'; // 좋아요 함수
import { useUser } from '../context/UserIdContext'; // ✅ UserContext 사용
import { useFilter } from '../context/FilterContext';

import Layout from '../page/Layout';

import sheart from '../assets/sheart.png';
import fillheart from '../assets/fill_sheart.png';

import './ColorList.css';

const ColorList = () => {
    const {
        allColors,
        colors,
        page,
        setPage,
        hasMore,
        sortType,
        filteredColors,
        setFilteredColors,
        loading,
        setLoading,
        isClick,
        setIsClick,
        handleOptionOpen,
    } = useFilter();

    const location = useLocation();
    const observer = useRef(); // 페이지 하단 확인

    const [search, SetSearch] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const typeFilter = queryParams.get('type') || '';
    const colorFilter = queryParams.get('color') || '';

    const [fade, setFade] = useState(false); // 부드럽게 컬러조합 랜더링 상태

    const [copyStatus, setCopyStatus] = useState(null); // 색상복사 상태

    const { userId, likedItems, setLikedItems } = useUser(); // ✅ 전역 Context에서 가져오기

    const loadingRef = useRef(false);

    //  무한 스크롤 (Intersection Observer)
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    const lastElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (
                        entries[0].isIntersecting &&
                        !loadingRef.current && // ✅ 최신 loading 상태 확인
                        hasMore
                    ) {
                        setPage((prev) => prev + 1);
                    }
                },
                { threshold: 1 }
            );

            if (node) observer.current.observe(node);
        },
        [hasMore]
    );

    //  필터 변경시 부드럽게 컬러조합 랜더링
    useEffect(() => {
        setFade(false); // 변경 시 먼저 투명하게
        setTimeout(() => setFade(true), 300); // 0.1초 뒤 페이드인 효과 적용
    }, [typeFilter, colorFilter, search, location]); // 필터 변경 시 트랜지션 적용

    return (
        <Layout
            SetSearch={SetSearch}
            search={search}
            isClick={isClick}
            likedItems={likedItems}
            filteredColors={filteredColors}
            colors={colors}
            sortType={sortType}
            handleOptionOpen={handleOptionOpen}
            allColors={allColors}
        >
            <div className="palette-container">
                <div className={`palette-grid ${fade ? 'fadeIn' : 'fadeOut'}`}>
                    {filteredColors.length > 0 ? (
                        filteredColors.map((palette, index) => (
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
                                            >
                                                <span
                                                    onClick={(e) => handleCopy(e, color.hex, setCopyStatus)}
                                                    className="pcHover"
                                                >
                                                    {copyStatus === color.hex ? 'Copy!' : color.hex}
                                                </span>
                                            </div>
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
                    <div className="scrollBottomCheck" ref={lastElementRef}></div>
                </div>
            </div>
        </Layout>
    );
};

export default ColorList;
