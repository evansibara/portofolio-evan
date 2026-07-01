/**
 * scrollLock.js — Ref-counted body scroll lock utility
 *
 * KENAPA INI DIPERLUKAN:
 * Sebelumnya, setiap modal (ProjectModal, CertLightbox) langsung menulis
 * `document.body.style.overflow = 'hidden' / ''` masing-masing secara
 * independen. Ini rawan bug:
 *
 *  1. Race condition — jika dua modal sempat aktif berdekatan waktu,
 *     modal A yang unmount duluan bisa me-reset overflow ke '' padahal
 *     modal B masih terbuka dan butuh scroll tetap terkunci.
 *  2. Tidak ada "source of truth" tunggal — gampang lupa unlock di salah
 *     satu titik saat kode berkembang.
 *
 * SOLUSI: ref-counted lock. Setiap kali modal dibuka, counter naik. Body
 * hanya benar-benar di-unlock ketika counter kembali ke 0. Aman dipanggil
 * berkali-kali dari komponen manapun tanpa saling menimpa.
 */

let lockCount = 0;
let originalOverflow = '';

export function lockScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = originalOverflow;
  }
}