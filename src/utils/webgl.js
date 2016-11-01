

// from: http://www.browserleaks.com/webgl#howto-detect-webgl
export function hasWebgl()
{
  if (!!window.WebGLRenderingContext) {
    const canvas = document.createElement('canvas');
    const names = ['webgl', 'experimental-webgl', 'moz-webgl'];
    let gl = false;

    for (let i in names) {
      try {
        gl = canvas.getContext(names[i]);
        if (gl && typeof gl.getParameter == 'function') {
          /* WebGL is enabled */
          /* return true; */
          return names[i];
        }
      } catch (e) {}
    }

    /* WebGL is supported, but disabled */
    return false;
  }

  /* WebGL not supported*/
  return false;
}
