import { getCurrentLocale } from './stores/locale';
import { getOptions } from './configs';
import { flush } from './modules/loaderQueue';

import type { MessageObject } from './types/index';

// defineMessages allow us to define and extract dynamic message ids
export function defineMessages(i: Record<string, MessageObject>) {
  return i;
}

export function waitLocale(locale?: string) {
  return flush(locale || getCurrentLocale() || getOptions().initialLocale!);
}

// setup
export { init } from './configs';
export { addMessages } from './stores/dictionary';
export { registerLocaleLoader as register } from './modules/loaderQueue';

// stores
export { $locale as locale } from './stores/locale';
export { $dictionary as dictionary, $locales as locales } from './stores/dictionary';
export { $isLoading as isLoading } from './stores/loading';

// reactive methods
export {
  $format as format,
  $format as _,
  $format as t,
  $formatDate as date,
  $formatNumber as number,
  $formatTime as time,
  $getJSON as json,
} from './stores/formatters';

// low-level
export {
  getDateFormatter,
  getNumberFormatter,
  getTimeFormatter,
  getMessageFormatter,
} from './modules/formatters';

// utils
export { unwrapFunctionStore } from './modules/unwrapFunctionStore';
export {
  getLocaleFromHostname,
  getLocaleFromPathname,
  getLocaleFromNavigator,
  getLocaleFromQueryString,
  getLocaleFromHash,
} from './modules/localeGetters';
