require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { addInitialColors } = require('./generateColors');

const app = express();
app.use(express.json());
app.use(cors());

// 이미 컬러 데이터가 있기 때문에 실행하지 않음
addInitialColors();

//  컬러 데이터 불러오기 API
app.get('/colors', async (req, res) => {
    try {
        const { type, color, page = 1, limit = 20 } = req.query;
        const offset = (Math.max(page, 1) - 1) * limit;

        let query = 'SELECT * FROM colorPalettes WHERE 1=1';
        let queryParams = [];

        if (type) {
            query += ' AND JSON_CONTAINS(types, CAST(? AS JSON))';
            queryParams.push(`["${type}"]`); // ✅ JSON 배열 변환
        }
        if (color) {
            query += ' AND JSON_CONTAINS(colorOption, CAST(? AS JSON))';
            queryParams.push(JSON.stringify({ name: color }));
        }

        query += ' LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));



        const [results] = await pool.query(query, queryParams);
        res.json(results);
    } catch (err) {
        console.error('❌ 색상 조회 오류:', err);
        res.status(500).json({ error: '데이터를 불러오는 중 오류 발생' });
    }
});

// 컬러 조합 상세페이지
app.get('/colors/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await pool.query('SELECT * FROM colorpalettes WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: '❌ 해당 컬러 조합이 없습니다.' });
        }

        const colorData = results[0];
        colorData.colors = colorData.colors;
        colorData.types = colorData.types;

        res.json(colorData);
    } catch (err) {
        console.error('❌ 컬러 조회 오류:', err);
        res.status(500).json(err);
    }
});

//  컬러 조합 저장 API
app.post('/add-color', async (req, res) => {
    const { colors, types } = req.body;
    const query = `INSERT INTO colorpalettes (colors, types) VALUES (?, ?)`;

    try {
        const [result] = await pool.query(query, [JSON.stringify(colors), JSON.stringify(types)]);
        res.json({ message: '컬러 조합 저장 완료!' });
    } catch (err) {
        console.error('❌ 컬러 저장 실패:', err);
        res.status(500).json(err);
    }
});

// 특정 컬러 포함된 조합 필터링 API
app.get('/filter-colors', async (req, res) => {
    const { color } = req.query;
    const query = `SELECT * FROM colorpalettes WHERE JSON_CONTAINS(colors, CAST(? AS JSON))`;

    try {
        const [results] = await pool.query(query, [JSON.stringify([{ hex: color }])]);
        res.json(results);
    } catch (err) {
        console.error('❌ 컬러 필터링 오류:', err);
        res.status(500).json(err);
    }
});

// ✅ 좋아요 토글 API
app.post('/colors/:id/like', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!id || !user_id) {
        return res.status(400).json({ error: 'Invalid request: missing id or user_id' });
    }

    try {

        // ✅ 해당 사용자의 좋아요 여부 확인
        const [rows] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND color_id = ?', [user_id, id]);

        let newFavorite;
        let liked;

        if (rows.length > 0) {
            // ✅ 좋아요 취소 (기록 삭제)
            await pool.query('DELETE FROM likes WHERE user_id = ? AND color_id = ?', [user_id, id]);
            await pool.query('UPDATE colorpalettes SET favorite = favorite - 1 WHERE id = ?', [id]);

            const [updatedRows] = await pool.query('SELECT favorite FROM colorpalettes WHERE id = ?', [id]);
            newFavorite = updatedRows[0].favorite;
            liked = false;
        } else {
            // ✅ 좋아요 추가 (기록 저장)
            await pool.query('INSERT INTO likes (user_id, color_id) VALUES (?, ?)', [user_id, id]);
            await pool.query('UPDATE colorpalettes SET favorite = favorite + 1 WHERE id = ?', [id]);

            const [updatedRows] = await pool.query('SELECT favorite FROM colorpalettes WHERE id = ?', [id]);
            newFavorite = updatedRows[0].favorite;
            liked = true;
        }

        return res.json({ liked, favorite: newFavorite });
    } catch (error) {
        console.error('❌ 좋아요 토글 실패:', error);
        return res.status(500).json({ success: false });
    }
});

app.get('/user/:user_id/likes', async (req, res) => {
    const { user_id } = req.params;

    try {
        const [likedColors] = await pool.query('SELECT color_id FROM likes WHERE user_id = ?', [user_id]);

        if (!likedColors.length) {
            return res.status(200).json({ likedItems: [] }); // ✅ 사용자가 좋아요한 항목이 없으면 빈 배열 반환
        }

        const likedIds = likedColors.map((row) => row.color_id); // ✅ 좋아요한 색상 ID 목록
        return res.json({ likedItems: likedIds });
    } catch (error) {
        console.error('❌ 좋아요 목록 불러오기 실패:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

//  서버 실행
app.listen(5000, () => {
    console.log('🚀 서버 실행 중');
});
