
// API 路由用于保存玩家分数到 PostgreSQL 数据库
const { Pool } = require('pg');

// 创建数据库连接池
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_3KfAB0ypIFaO@ep-lingering-voice-a1fqfc92-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  try {
    const { playerName, score } = req.body;

    // 验证必要的输入数据
    if (!playerName || typeof score !== 'number') {
      return res.status(400).json({ error: '缺少必要的玩家名称或分数' });
    }

    // 插入数据到数据库
    const query = 'INSERT INTO player_score (player_name, score) VALUES ($1, $2) RETURNING *';
    const values = [playerName, score];

    const result = await pool.query(query, values);

    // 返回成功响应
    return res.status(200).json({ 
      success: true, 
      message: '分数保存成功',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('保存分数时出错:', error);
    return res.status(500).json({ 
      error: '保存分数时出错', 
      details: error.message 
    });
  }
}
