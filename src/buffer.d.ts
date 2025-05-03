// Global type declarations for the Buffer polyfill
interface Window {
  Buffer: typeof import('buffer').Buffer;
}
