# Backend Unit Tests

This directory contains unit tests for the Student Assistant server.

## Running Tests

- **Run all tests**: `npm test`
- **Run tests in watch mode**: `npm test -- --watch`
- **Run tests with UI**: `npm run test:ui`
- **Generate coverage report**: `npm run test:coverage`

## Test Structure

Tests are organized by module:

- `pdfUtils.test.ts` - Tests for PDF text extraction and chunking functionality
- `helpers.test.ts` - Tests for Supabase, OpenAI client initialization and authentication
- `noteHandler.test.ts` - Tests for note creation and searching functionality

## Test Framework

This project uses **Vitest** for unit testing, which provides:

- Fast test execution with native ES modules support
- Familiar Jest-like API
- Built-in coverage reporting
- Watch mode for development

## Coverage Goals

- **pdfUtils**: High coverage for text chunking logic
- **helpers**: Test client initialization and error handling
- **noteHandler**: Test embedding generation and search functionality

## Mocking Strategy

Tests use `vi.mock()` for external dependencies:
- Supabase client calls are mocked
- OpenAI API calls are mocked
- Database operations are mocked

This allows tests to run without external services.

## Adding New Tests

When adding new functionality, follow these patterns:

1. Create a new test file in `__tests__/` directory
2. Use descriptive test names with `describe` and `it` blocks
3. Mock external dependencies
4. Test both success and error cases
5. Use meaningful assertions

Example:
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('myModule', () => {
  it('should do something specific', () => {
    expect(result).toBe(expected);
  });
});
```
