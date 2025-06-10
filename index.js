const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const checkShopeePhone = require('./puppeteer-check');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/check', async (req, res) => {
  const phone = req.body.phone;
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
  }

  try {
    const result = await checkShopeePhone(phone);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Phục vụ index.html từ cùng thư mục
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running...');
});
