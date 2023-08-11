import { DeepReadonly } from './deep-readonly';

export function deepFreeze<T extends object>(target: T): DeepReadonly<T> {
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
      const propValue = (target as Record<string, unknown>)[prop];

      if (
        (isObjectLike(propValue) || isFunction(propValue)) &&
        !Object.isFrozen(propValue)
      ) {
        deepFreeze(propValue);
      }
    }
  }

  return target as DeepReadonly<T>;
}

function isFunction(target: unknown): target is () => unknown {
  return typeof target === 'function';
}

function isObjectLike(target: unknown): target is object {
  return typeof target === 'object' && target !== null;
}
