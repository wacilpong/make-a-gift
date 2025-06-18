# 1
```
npm create vite@latest . -- --template vanilla
npm install @tauri-apps/cli @tauri-apps/api --save-dev
npx tauri init
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
