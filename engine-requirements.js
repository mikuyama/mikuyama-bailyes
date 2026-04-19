const major = parseInt(process.versions.node.split('.')[0], 10);
const minor = parseInt(process.versions.node.split('.')[1], 10);

if (major < 20) {
  console.error(
    `\n❌ Node.js ${process.versions.node} tidak didukung.\n` +
    `   Paket ini memerlukan Node.js 20 hingga 24.\n` +
    `   Silakan upgrade ke Node.js 20, 21, 22, 23, atau 24.\n` +
    `   Download: https://nodejs.org\n`
  );
  process.exit(1);
}

if (major > 24) {
  console.warn(
    `\n⚠️  Node.js ${process.versions.node} belum diuji secara resmi.\n` +
    `   Versi yang didukung secara penuh: Node.js 20 hingga 24.\n` +
    `   Library mungkin tetap berjalan, namun tidak ada jaminan stabilitas.\n`
  );
}

if (major >= 20 && major <= 24) {
  // Node.js 20–24 fully supported
}
