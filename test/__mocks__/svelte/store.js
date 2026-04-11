// Mock for svelte/store to work with Jest
// Svelte 5 uses pure ESM which Jest has trouble with

function writable(value, start = () => {}) {
  let subscribers = [];
  let stop = null;

  function set(newValue) {
    value = newValue;
    subscribers.forEach((fn) => fn(value));
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(fn) {
    fn(value);
    subscribers.push(fn);

    if (subscribers.length === 1) {
      stop = start(set) || (() => {});
    }

    return () => {
      const index = subscribers.indexOf(fn);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }

  return { set, update, subscribe };
}

function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe,
  };
}

function derived(stores, fn, initialValue) {
  const single = !Array.isArray(stores);
  const storesArray = single ? [stores] : stores;

  const auto = fn.length < 2;

  return readable(initialValue, (set) => {
    let inited = false;
    const values = [];

    let pending = 0;
    let cleanup = () => {};

    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = typeof result === 'function' ? result : () => {};
      }
    };

    const unsubscribers = storesArray.map((store, i) => {
      pending |= 1 << i;
      return store.subscribe((value) => {
        values[i] = value;
        pending &= ~(1 << i);
        if (inited) {
          sync();
        }
      });
    });

    inited = true;
    sync();

    return function stop() {
      unsubscribers.forEach((fn) => fn());
      cleanup();
    };
  });
}

function readonly(store) {
  return {
    subscribe: store.subscribe.bind(store),
  };
}

function get(store) {
  let value;
  store.subscribe(($) => (value = $))();
  return value;
}

module.exports = {
  writable,
  readable,
  derived,
  readonly,
  get,
};
