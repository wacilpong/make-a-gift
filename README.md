# 1
```
npm create vite@latest . -- --template vanilla
npm install @tauri-apps/cli @tauri-apps/api --save-dev
npx tauri init
```
```
// rust 1.67v 이상 사용하기
rustc --version
rustup update
```

# 2
```
// vite.config.js
// vite는 자동으로 루트 디렉토리의 vite.config.js 파일을 감지함
  export default defineConfig({
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          program: 'program.html',
        }
      }
    }
  });
```
```
// tauri.conf.json
// url을 특정 파일인덱스로 잡아주면 그것만 프로그램으로 띄울 수 있다.
// npm run tauri dev
  "app": {
    "windows": [
      {
        "title": "make-a-gift",
        "width": 800,
        "height": 600,
        "resizable": false,
        "fullscreen": false,
        "url": "program.html"
      }
    ],
...
```

# 3
```
// 프로그램 다운로드를 위한 서버(노드) 생성
// node server.js
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
```
