const { scryptSync, randomBytes } = require('node:crypto');

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Run this command in an interactive terminal so the password is not echoed.');
  process.exit(1);
}

const input = process.stdin;
const output = process.stdout;
const wasRaw = input.isRaw;
let password = '';
output.write('Nhập mật khẩu (ký tự được che): ');
input.setRawMode(true);
input.resume();
input.setEncoding('utf8');
input.on('data', (key) => {
  if (key === '\u0003') { output.write('\n'); process.exit(130); }
  if (key === '\r' || key === '\n') {
    input.setRawMode(Boolean(wasRaw)); input.pause(); output.write('\n');
    if (password.length < 12) { console.error('Mật khẩu cần ít nhất 12 ký tự.'); process.exit(1); }
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 });
    password = '';
    console.log(`scrypt$16384$8$1$${salt.toString('base64url')}$${hash.toString('base64url')}`);
    process.exit(0);
  }
  if (key === '\u007f' || key === '\b') { password = password.slice(0, -1); return; }
  if (key >= ' ') { password += key; output.write('*'); }
});
