const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://colorcolor.onrender.com';

export const fetchColors = async ({ type = '', color = '', page = 1, limit = 20 }) => {
    try {
        let query = `${API_BASE_URL}/colors?page=${page}&limit=${limit}`;
        if (type) query += `&type=${type}`;
        if (color) query += `&color=${color}`;

        const response = await fetch(query);
        return await response.json();
    } catch (error) {
        console.error('❌ API 요청 실패:', error);
        return [];
    }
};

// ✅ 특정 컬러 조합 상세 정보 가져오기
export const fetchColorById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/colors/${id}`);

        if (!response.ok) {
            throw new Error(`❌ API 요청 실패: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`❌ ID ${id} 컬러 상세 조회 실패:`, error);
        return null;
    }
};
