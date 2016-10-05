/**
 * Selectors for raw
 */


 export function getRawTests(state) {
   if (state.raw.tests.data) {
     return state.raw.tests.data;
   }
   return [];
 }
