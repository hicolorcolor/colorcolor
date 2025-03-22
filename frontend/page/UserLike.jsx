import { useEffect } from 'react';
import { useUser } from '../context/UserIdContext'; // ✅ 전역 Context 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://colorcolor.onrender.com';

import React from 'react';

function UserLike() {
    const { userId, likedItems, setLikedItems } = useUser(); // ✅ 전역 Context에서 상태 가져오기

    useEffect(() => {
        if (!userId) return; // ✅ userId가 없으면 실행하지 않음

        const fetchLikedItems = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/user/${userId}/likes`);
                if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

                const data = await response.json();
                setLikedItems(new Set(data.likedItems || [])); // ✅ 서버에서 가져온 좋아요 목록 저장
            } catch (error) {
                console.error('❌ 좋아요 데이터 불러오기 실패:', error);
            }
        };

        fetchLikedItems();
    }, [userId, setLikedItems]); // ✅ userId가 변경될 때만 실행

    return (
        <div>
            <h2>사용자가 좋아요한 항목</h2>
            <ul>
                {[...likedItems].map((item) => (
                    <li key={item}>색상 ID: {item}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserLike;
