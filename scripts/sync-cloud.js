const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'cloud', 'functions');
const destDir = path.resolve(__dirname, '..', 'dist', 'cloud', 'functions');
const configSrc = path.resolve(__dirname, '..', 'project.config.json');
const configDest = path.resolve(__dirname, '..', 'dist', 'project.config.json');

// 同步云函数目录（含 node_modules）
if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Cloud functions synced to dist/cloud/functions/');
}

// 生成 dist/project.config.json（miniprogramRoot 改为 ./）
if (fs.existsSync(configSrc)) {
  const config = JSON.parse(fs.readFileSync(configSrc, 'utf8'));
  config.miniprogramRoot = './';
  fs.writeFileSync(configDest, JSON.stringify(config, null, 2));
  console.log('project.config.json synced (miniprogramRoot=./)');
}
