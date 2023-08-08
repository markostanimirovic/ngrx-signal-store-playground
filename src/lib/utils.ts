export function deepFreeze<T extends object>(target: T): T {
  Object.freeze(target);

  const targetIsFunction = isFunction(target);

  for (const prop of Object.getOwnPropertyNames(target)) {
    // Do not freeze Ivy properties (e.g. router state)
    // https://github.com/ngrx/platform/issues/2109#issuecomment-582689060
    if (prop.startsWith('ɵ')) {
      continue;
    }

    if (
      Object.hasOwn(target, prop) &&
      (targetIsFunction
        ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
        : true)
    ) {
      // @ts-ignore
      const propValue = target[prop];

      if (
        (isObjectLike(propValue) || isFunction(propValue)) &&
        !Object.isFrozen(propValue)
      ) {
        deepFreeze(propValue);
      }
    }
  }

  return target;
}

export function isFunction(target: unknown): target is () => unknown {
  return typeof target === 'function';
}

export function isObjectLike(target: unknown): target is object {
  return typeof target === 'object' && target !== null;
}
