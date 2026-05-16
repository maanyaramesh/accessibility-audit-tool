const express = require('express');
const cors = require('cors');
const { runAudit } = require('./auditor');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/audit', async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid URL is required' });
  }
  try {
    const results = await runAudit(url);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));