const express = require('express');
const router = express.Router();
const db = require('../db'); // ✅ MySQL 연결

// ✅ 좋아요 토글 API
app.post('/:id/like', async (req, res) => {
    // ✅ "/api/:id/like"가 아니라 "/:id/like"로 설정
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        const [rows] = await db.query('SELECT favorite FROM colorpalettes WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '팔레트 없음' });
        }

        let newFavorite;
        if (req.session?.likedPalettes?.[user_id]?.includes(id)) {
            // ✅ 좋아요 취소
            await db.query('UPDATE colorpalettes SET favorite = favorite - 1 WHERE id = ?', [id]);
            newFavorite = rows[0].favorite - 1;
            req.session.likedPalettes[user_id] = req.session.likedPalettes[user_id].filter(
                (paletteId) => paletteId !== id
            );
            return res.json({ liked: false, favorite: newFavorite });
        } else {
            // ✅ 좋아요 추가
            await db.query('UPDATE colorpalettes SET favorite = favorite + 1 WHERE id = ?', [id]);
            newFavorite = rows[0].favorite + 1;
            req.session.likedPalettes[user_id] = [...(req.session.likedPalettes[user_id] || []), id];
            return res.json({ liked: true, favorite: newFavorite });
        }
    } catch (error) {
        console.error('❌ 좋아요 토글 실패:', error);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
