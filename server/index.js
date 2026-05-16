const express = require('express');
const cors = require('cors');
const { runAudit } = require('./auditor');

const app = express();

app.use(express.json());
app.use(cors());

// POST /audit endpoint
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});