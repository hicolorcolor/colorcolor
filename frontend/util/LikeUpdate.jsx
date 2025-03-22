export const handleLikeToggle = async (event, id, setFilteredColors, setLikedItems, likedItems, userId) => {
    event.preventDefault();
    event.stopPropagation();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://colorcolor.onrender.com';

    try {
        const response = await fetch(`${API_BASE_URL}/colors/${id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
            console.error('서버 응답 오류:', response.status);
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setFilteredColors((prevColors) =>
                prevColors.map((palette) =>
                    palette.id === id
                        ? { ...palette, favorite: data.favorite } // ✅ 좋아요 숫자 동기화
                        : palette
                )
            );

            setLikedItems((prev) => {
                const newLikedItems = new Set(prev);
                if (data.liked) {
                    newLikedItems.add(id);
                } else {
                    newLikedItems.delete(id);
                }
                return newLikedItems;
            });
        }
    } catch (error) {
        console.error('좋아요 토글 실패:', error);
    }
};
