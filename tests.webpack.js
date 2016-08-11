var context = require.context('./src', true, /-test\.(js|jsx)$/);
context.keys().forEach(context);
