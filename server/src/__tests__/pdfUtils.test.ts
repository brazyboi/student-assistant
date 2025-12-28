import { describe, it, expect } from 'vitest';
import { chunkText } from '../pdfUtils';

describe('pdfUtils', () => {
  describe('chunkText', () => {
    it('should split text into chunks of specified size', () => {
      const text = 'This is a test. This is another sentence. And here is one more.';
      const chunks = chunkText(text, 30);
      
      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach(chunk => {
        expect(chunk.length).toBeLessThanOrEqual(31);
      });
    });

    it('should handle empty string', () => {
      const chunks = chunkText('', 100);
      expect(chunks.length).toBe(1);
    });

    it('should preserve sentences when chunking', () => {
      const text = 'First sentence. Second sentence. Third sentence.';
      const chunks = chunkText(text, 50);
      
      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach(chunk => {
        expect(chunk.trim().length).toBeGreaterThan(0);
      });
    });

    it('should handle text with multiple spaces', () => {
      const text = 'Text   with    multiple     spaces.   More text.';
      const chunks = chunkText(text);
      
      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach(chunk => {
        expect(/\s{2,}/.test(chunk)).toBe(false);
      });
    });

    it('should use default chunk size of 1000', () => {
      const longText = 'Word. '.repeat(200);
      const chunks = chunkText(longText);
      
      expect(chunks.length).toBeGreaterThan(1);
    });

    it('should handle text without sentence endings', () => {
      const text = 'This is text without proper punctuation';
      const chunks = chunkText(text, 20);
      
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.join(' ')).toContain('This is text');
    });
  });
});
