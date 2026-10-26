/* Loads the admin editor and reports clearly when files are missing or mismatched. */
const expected = 'portfolio-studio-v9-20261026';
const label = document.getElementById('build-status');
const appStatus = document.getElementById('app-status');

function fail(error) {
  document.documentElement.dataset.adminBootBuild = 'failed';
  label.className = 'notice status error';
  label.textContent = 'Editor V9 belum termuat. Pastikan admin.js, cms.js, dan firebase-config.js berada di folder yang sama dengan admin.html, folder assets/ ikut terunggah, dan nama berkas tidak berakhiran .txt. Lalu muat ulang tanpa cache (hard refresh).';
  appStatus.hidden = false;
  appStatus.className = 'notice status error';
  appStatus.textContent = 'Detail pemuatan: ' + (error && error.message ? error.message : 'Berkas JavaScript belum dapat dibaca.');
  console.error('Portfolio editor bootstrap:', error);
}

const timer = setTimeout(() => {
  if (!document.documentElement.dataset.adminBootBuild) fail(new Error('Pemuatan modul terlalu lama. Periksa koneksi, folder berkas, dan respons hosting.'));
}, 15000);

import('../../admin.js?v=' + expected).then(() => {
  clearTimeout(timer);
  if (document.documentElement.dataset.adminBootBuild !== expected) fail(new Error('Versi admin.js tidak cocok. Unggah ulang seluruh paket V9.'));
}).catch(error => { clearTimeout(timer); fail(error); });
