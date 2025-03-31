// FilterContext.jsx 최종본
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchColors } from '../api/fetchColor';
import { useUser } from './UserIdContext';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const typeFilter = queryParams.get('type') || '';
    const colorFilter = queryParams.get('color') || '';
    const sortType = queryParams.get('sort') || 'latest';
    const [isFetching, setIsFetching] = useState(false);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [colors, setColors] = useState([]);
    const [filteredColors, setFilteredColors] = useState([]);
    const { likedItems } = useUser();
    const [allColors, setAllColors] = useState([]);
    const [isClick, setIsClick] = useState(false);

    // 정렬 함수
    const sortColors = (colors, sortType, likedItems) => {
        let sortedColors = [...colors];

        const normalizedLikedItems = new Set([...likedItems].map((id) => Number(id)));

        if (sortType === 'latest') {
            sortedColors.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortType === 'favorite') {
            sortedColors.sort((a, b) => b.favorite - a.favorite);
        } else if (sortType === 'userLike') {
            const filtered = colors.filter((palette) => normalizedLikedItems.has(palette.id));
            return filtered;
        }
        return sortedColors;
    };

    useEffect(() => {
        setPage(1);
        setColors([]);
        setHasMore(true);
    }, [typeFilter, colorFilter, sortType]);

    useEffect(() => {
        const loadColors = async () => {
            setLoading(true);
            const data = await fetchColors({ type: typeFilter, color: colorFilter, page, limit: 20 });

            if (page === 1) {
                setColors(data);
                setAllColors((prev) => {
                    const mergedColors = [...prev, ...data];
                    const uniqueColors = Array.from(new Map(mergedColors.map((item) => [item.id, item])).values());
                    return uniqueColors;
                });
            } else {
                setColors((prev) => [...prev, ...data]);
                setAllColors((prev) => {
                    const mergedColors = [...prev, ...data];
                    const uniqueColors = Array.from(new Map(mergedColors.map((item) => [item.id, item])).values());
                    return uniqueColors;
                });
            }

            setHasMore(data.length > 0);
            setLoading(false);
        };

        if (page === 1 || hasMore) {
            loadColors();
        }
    }, [page, typeFilter, colorFilter, sortType]);

    useEffect(() => {
        if (!colors || colors.length === 0 || likedItems === undefined) return;

        setFilteredColors(sortColors([...colors], sortType, new Set(likedItems)));
    }, [colors, sortType, likedItems]);

    const handleFilterChange = (type) => {
        const newQueryParams = new URLSearchParams();
        if (type !== '/') {
            newQueryParams.set('sort', type);
        }
        navigate(`/?${newQueryParams.toString()}`, { replace: true });

        setPage(1);
        setHasMore(true);
        setColors([]);
    };

    const handleOptionOpen = (state) => {
        setIsClick(state);
    };

    return (
        <FilterContext.Provider
            value={{
                handleFilterChange,
                page,
                setPage,
                hasMore,
                setHasMore,
                colors,
                setColors,
                filteredColors,
                sortType,
                typeFilter,
                colorFilter,
                setFilteredColors,
                isFetching,
                setIsFetching,
                loading,
                setLoading,
                allColors,
                isClick,
                setIsClick,
                handleOptionOpen,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
