#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting local Lighthouse CI test...\n');

// 构建项目
console.log('📦 Building project...');
const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

build.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  
  console.log('✅ Build completed\n');
  
  // 启动静态服务器
  console.log('🌐 Starting static server...');
  const server = spawn('npx', ['serve', '-s', 'out', '-l', '8080'], { 
    stdio: 'pipe',
    detached: true 
  });
  
  // 等待服务器启动
  setTimeout(() => {
    console.log('🔍 Running Lighthouse CI...\n');
    
    // 运行Lighthouse CI
    const lhci = spawn('npx', ['lhci', 'autorun', '--config=lighthouserc.cjs'], { stdio: 'inherit' });
    
    lhci.on('close', (code) => {
      // 关闭服务器
      process.kill(-server.pid);
      
      if (code === 0) {
        console.log('\n✅ Lighthouse CI completed successfully!');
        console.log('📊 Check the results in .lighthouseci/ directory');
      } else {
        console.log('\n⚠️  Lighthouse CI completed with warnings');
        console.log('📊 Check the results in .lighthouseci/ directory');
      }
      
      process.exit(code);
    });
    
  }, 3000);
});

// 处理中断信号
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Lighthouse CI...');
  process.exit(0);
});