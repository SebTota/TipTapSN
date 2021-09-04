
/*
* https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/utilities/elementFromString.ts
*/
export function elementFromString (value) {
  const wrappedValue = `<body>${value}</body>`;
  return new window.DOMParser().parseFromString(wrappedValue, 'text/html').body;
}
