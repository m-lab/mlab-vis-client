/**
 * Taken from React's PureRenderMixin - https://github.com/francoislaberge/pure-render-mixin/blob/master/src/shallow-equal.js
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {Boolean}
 */
export default function shallowEquals(objA, objB, excludeKeys) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  let keysA = Object.keys(objA);
  let keysB = Object.keys(objB);

  if (excludeKeys) {
    keysA = keysA.filter(key => excludeKeys.indexOf(key) === -1);
    keysB = keysB.filter(key => excludeKeys.indexOf(key) === -1);
  }

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}


/**
 * Logs and returns an array showing the places where shallow equals failed or the string "equal"
 */
export function shallowEqualsDebug(objA, objB) {
  let result;
  if (shallowEquals(objA, objB)) {
    result = 'equal';
  } else {
    result = Object.keys(objA)
      .filter(key => objA[key] !== objB[key])
      .map(key => ({ key, a: objA[key], b: objB[key] }))
      .reduce((acc, elem) => {
        acc.push(elem.key);
        acc.push(elem.a);
        acc.push(elem.b);
        return acc;
      }, []);
  }

  console.log('shallowEqualsDebug:', result);
  return result;
}
