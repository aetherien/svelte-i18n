import { defineMessages, waitLocale, register, init } from '../../src/runtime';
import { $locale } from '../../src/runtime/stores/locale';
import { hasLocaleQueue } from '../../src/runtime/modules/loaderQueue';
import {
  getLocaleDictionary,
  $dictionary,
} from '../../src/runtime/stores/dictionary';
import { $format } from '../../src/runtime/stores/formatters';

test('defineMessages returns the identity of its first argument', () => {
  const obj = {};

  expect(obj).toBe(defineMessages(obj));
});

describe('waiting for a locale to load', () => {
  beforeEach(() => {
    $dictionary.set({});
    $locale.set(undefined);
  });

  it('should wait for a locale queue to be flushed', async () => {
    register('en', () => Promise.resolve({ foo: 'foo' }));
    $locale.set('en');

    await waitLocale('en');

    expect(hasLocaleQueue('en')).toBe(false);
    expect(getLocaleDictionary('en')).toMatchObject({ foo: 'foo' });
  });

  it('should wait for the current locale queue to be flushed', async () => {
    register('en', () => Promise.resolve({ foo: 'foo' }));
    init({ fallbackLocale: 'pt', initialLocale: 'en' });

    await waitLocale();

    expect(hasLocaleQueue('en')).toBe(false);
    expect(getLocaleDictionary('en')).toMatchObject({ foo: 'foo' });
  });

  it('should wait for the fallback locale queue to be flushed if initial not set', async () => {
    register('pt', () => Promise.resolve({ foo: 'foo' }));
    init({ fallbackLocale: 'pt' });

    await waitLocale();

    expect(hasLocaleQueue('pt')).toBe(false);
    expect(getLocaleDictionary('pt')).toMatchObject({ foo: 'foo' });
  });
});

describe('format updates', () => {
  beforeEach(() => {
    init({ fallbackLocale: 'en' });
  });

  it('format store is updated when locale changes', () => {
    const fn = jest.fn();
    const cancel = $format.subscribe(fn);

    $locale.set('pt');
    // With the mock store implementation, derived stores call subscribers
    // once on initial subscription and once when dependencies change
    // Since $format depends on both $locale and $dictionary, we get 3 calls:
    // 1) initial subscription to readable, 2) sync() call, 3) locale change
    expect(fn).toHaveBeenCalledTimes(3);
    cancel();
  });

  it('format store is updated when dictionary changes', () => {
    const fn = jest.fn();
    const cancel = $format.subscribe(fn);

    $dictionary.set({});
    // Same as above - 3 calls due to mock implementation
    expect(fn).toHaveBeenCalledTimes(3);
    cancel();
  });
});
