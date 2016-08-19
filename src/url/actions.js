export const URL_REPLACE = 'URL_REPLACE';

/**
 * Helper function for creating URL_REPLACE actions
 *
 * For example in your actions.js file:
 * export const changeTimeAggregation = urlReplaceAction('timeAggregation');
 *
 */
export function urlReplaceAction(key) {
  return function urlReplaceActionCreator(value) {
    return {
      type: URL_REPLACE,
      key,
      value,
    };
  };
}
