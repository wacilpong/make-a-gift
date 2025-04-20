const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
}));
app.use(express.static('public'));
app.use(express.json());

app.post('/build-app', async (req, res) => {
  execSync(`npm run build`, { cwd: path.join(__dirname), stdio: 'inherit' });

  const { person, gift } = req.body;

  if (!person || !gift) {
    return res.status(400).send('정보 누락됨');
  }

  const templatePath = path.join(__dirname, 'program.html');
  const distPath = path.join(__dirname, 'dist', 'program.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const message = `${person}님, 생일 축하해요! 🎂\n선물: ${gift}`;
  const compiled = template.replace('{{message}}', escapeHTML(message));

  fs.writeFileSync(distPath, compiled, 'utf-8');

  try {
    execSync(`npx tauri build`, {
      cwd: path.join(__dirname),
      stdio: 'inherit'
    });

    const appDir = path.join(__dirname, 'src-tauri', 'target', 'release', 'bundle', 'macos', 'make-a-gift.app');
    const zipPath = path.join(__dirname, 'src-tauri', 'target', 'release', 'bundle', 'macos', 'make-a-gift.zip');

    execSync(`ditto -c -k --sequesterRsrc --keepParent "${appDir}" "${zipPath}"`);
    res.download(zipPath);
  } catch (err) {
    console.error('빌드 실패:', err);
    res.status(500).send('앱 생성 중 오류 발생');
  }
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[m]);
}