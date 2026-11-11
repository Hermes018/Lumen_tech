#!/usr/bin/env node
/** @purpose Cross-platform memory-capped command runner enforcing 8GB RAM caps */

const { spawnSync } = require('child_process');

if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('--max-old-space-size')) {
  process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS + ' ' : '') + '--max-old-space-size=2048';
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node tooling/run.js <command> [args...]');
  process.exit(1);
}

const [cmd, ...cmdArgs] = args;
const result = spawnSync(cmd, cmdArgs, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 0);
