/*
 * Copies the specified string to the clipboard
 */

export function copyStringToClipboard(str) {
  if (typeof str !== "string") return;
  const tempElem = document.createElement("textarea");
  tempElem.value = str;
  // Hide element
  tempElem.style.position = "absolute";
  tempElem.style.left = "-999px";
  document.body.appendChild(tempElem);
  tempElem.select();
  document.execCommand("copy");
  document.body.removeChild(tempElem);
}
