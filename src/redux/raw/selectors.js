/**
 * Selectors for raw
 */


 export function getRawTests(state) {
   if (state.raw.data) {
     return state.raw.data;
   }
   return [];
 }
