/**
 * @jest-environment-options {"url": "http://example.com/"}
 */
import {
  getLocaleFromQueryString,
  getLocaleFromHash,
  getLocaleFromNavigator,
} from '../../../src/runtime/modules/localeGetters';

describe('getting client locale', () => {
  it('gets the locale based on the passed hash parameter', () => {
    // jsdom allows hash changes
    window.location.hash = '#locale=en-US&lang=pt-BR';
    expect(getLocaleFromHash('lang')).toBe('pt-BR');
  });

  it('gets the locale based on the navigator language', () => {
    expect(getLocaleFromNavigator()).toBe(window.navigator.language);
  });

  it('returns null if no locale was found', () => {
    expect(getLocaleFromQueryString('lang')).toBeNull();
  });
});
