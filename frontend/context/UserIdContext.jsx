import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

// ✅ 랜덤한 유저 ID 생성 함수
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

// ✅ Provider (전역 상태 관리)
export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [likedItems, setLikedItems] = useState(new Set());

    useEffect(() => {
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            storedUserId = generateUserId();
            localStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId); // ✅ 사용자 ID 설정

        // ✅ 서버에서 좋아요 데이터 불러오기
        const fetchLikedItems = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${storedUserId}/likes`);
                if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

                const data = await response.json();
                setLikedItems(new Set(data.likedItems || [])); // ✅ 서버 데이터 저장
            } catch (error) {
                console.error('❌ 좋아요 데이터 불러오기 실패:', error);
            }
        };

        fetchLikedItems();
    }, []);

    return <UserContext.Provider value={{ userId, likedItems, setLikedItems }}>{children}</UserContext.Provider>;
};

// ✅ Custom Hook (더 쉽게 사용하기)
export const useUser = () => useContext(UserContext);
