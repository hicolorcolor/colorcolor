require('dotenv').config();
const mysql = require('mysql2/promise'); // ✅ promise 기반 MySQL

// ✅ MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// ✅ `pool`을 내보내서 재사용 가능하게 설정
module.exports = pool;
