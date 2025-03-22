const tinycolor = require('tinycolor2');
const pool = require('./db');

const collections = [
    'Pastel', 'Vintage', 'Retro', 'Neon', 'Gold', 'Light', 'Dark', 'Warm', 'Cold',
    'Summer', 'Fall', 'Winter', 'Spring', 'Happy', 'Nature', 'Earth', 'Night', 'Space',
    'Rainbow', 'Gradient', 'Sunset', 'Sky', 'Sea', 'Kids', 'Skin', 'Food', 'Cream',
    'Coffee', 'Wedding', 'Christmas', 'Halloween',
];

const colorChip = [
    { name: 'Blue', hex: '#3498db' }, { name: 'Mint', hex: '#2ecc71' },
    { name: 'Green', hex: '#27ae60' }, { name: 'Sage', hex: '#49ad5a' },
    { name: 'Yellow', hex: '#f1c40f' }, { name: 'Beige', hex: '#f5deb3' },
    { name: 'Brown', hex: '#8b4513' }, { name: 'Orange', hex: '#e67e22' },
    { name: 'Peach', hex: '#f5b7b1' }, { name: 'Red', hex: '#e74c3c' },
    { name: 'Maroon', hex: '#800000' }, { name: 'Pink', hex: '#ff69b4' },
    { name: 'Purple', hex: '#9b59b6' }, { name: 'Navy', hex: '#2c3e50' },
    { name: 'Black', hex: '#222222' }, { name: 'Grey', hex: '#515151' },
    { name: 'White', hex: '#ffffff' },
];

const collectionBaseColors = {
    Pastel: '#FAD2E1', Vintage: '#D4A373', Retro: '#E63946', Neon: '#39FF14',
    Gold: '#FFD700', Light: '#FFFFFF', Dark: '#343A40', Warm: '#FF5733',
    Cold: '#007BFF', Summer: '#FFAE42', Fall: '#D2691E', Winter: '#4682B4',
    Spring: '#FFB6C1', Happy: '#FFD700', Nature: '#228B22', Earth: '#8B4513',
    Night: '#191970', Space: '#2C3E50', Rainbow: '#FF0000', Gradient: '#D16BA5',
    Sunset: '#FF4500', Sky: '#00BFFF', Sea: '#1E90FF', Kids: '#FF69B4',
    Skin: '#FFDFC4', Food: '#FFA500', Cream: '#FFFDD0', Coffee: '#6F4E37',
    Wedding: '#FFFFFF', Christmas: '#FF0000', Halloween: '#FF7518',
};

// ✅ 색상 거리 계산 함수
function colorDistance(hex1, hex2) {
    let c1 = tinycolor(hex1).toRgb();
    let c2 = tinycolor(hex2).toRgb();
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

// ✅ 컬러 타입 찾기
function findAllTypes(colors) {
    let typesSet = new Set();
    colors.forEach((color) => {
        Object.entries(collectionBaseColors).forEach(([type, baseHex]) => {
            if (colorDistance(color.hex, baseHex) < 50) typesSet.add(type);
        });
    });
    return Array.from(typesSet);
}

// ✅ 가까운 컬러 찾기
function findClosestColorWithHex(hex) {
    return colorChip.reduce((closest, color) => {
        let distance = colorDistance(hex, color.hex);
        return distance < colorDistance(hex, closest.hex) ? color : closest;
    });
}

// ✅ 색상 옵션 찾기
function findAllColorOptions(colors) {
    let colorOptionsSet = new Set();
    colors.forEach((color) => {
        let closestColor = findClosestColorWithHex(color.hex);
        if (closestColor) colorOptionsSet.add(JSON.stringify(closestColor));
    });
    return Array.from(colorOptionsSet).map((item) => JSON.parse(item));
}

// ✅ 컬러 조합 생성
function generateColorVariations(baseColor) {
    let baseHsl = tinycolor(baseColor).toHsl();
    let variations = new Set();
    while (variations.size < 4) {
        let modifiedHsl = {
            h: baseHsl.h + Math.random() * 20 - 10,
            s: Math.max(0, Math.min(1, baseHsl.s + (Math.random() * 0.2 - 0.1))),
            l: Math.max(0, Math.min(1, baseHsl.l + (Math.random() * 0.2 - 0.1))),
        };
        variations.add(tinycolor(modifiedHsl).toHexString());
    }
    return Array.from(variations);
}

// ✅ RGB 변환
function hexToRgb(hex) {
    let { r, g, b } = tinycolor(hex).toRgb();
    return `rgb(${r}, ${g}, ${b})`;
}

// ✅ 컬러 조합 생성 함수
function generateColorCombinations() {
    let selectedCollection = collections[Math.floor(Math.random() * collections.length)];
    let baseColor = collectionBaseColors[selectedCollection];
    let colors = generateColorVariations(baseColor).map((hex) => ({ hex, rgb: hexToRgb(hex) }));

    let types = findAllTypes(colors);
    let colorOptions = findAllColorOptions(colors);

    return { colors, types, colorOptions };
}

// ✅ 컬러 데이터 추가 함수 (date와 favorite 추가)
async function addInitialColors() {
    try {
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM colorpalettes');
        const count = result[0].count;


        if (count > 1000) {
            return;
        }

        let data = new Set();
        while (data.size < 1500) {
            let { colors, types, colorOptions } = generateColorCombinations();
            let key = JSON.stringify({ colors, types, colorOptions });
            data.add(key);
        }

        let today = new Date().toISOString().split('T')[0]; // ✅ 오늘 날짜 (YYYY-MM-DD)
        
        let formattedData = Array.from(data).map((item) => {
            let obj = JSON.parse(item);
            return [
                JSON.stringify(obj.colors),
                JSON.stringify(obj.types),
                JSON.stringify(obj.colorOptions),
                today, // ✅ 추가된 date
                Math.floor(Math.random() * 101), // ✅ favorite (0-100 랜덤값)
            ];
        });

        let sql = 'INSERT INTO colorpalettes (colors, types, colorOption, date, favorite) VALUES ?';
        const [insertResult] = await pool.query(sql, [formattedData]);
    } catch (err) {
        console.error('❌ 컬러 추가 실패:', err);
    }
}

module.exports = { addInitialColors };
