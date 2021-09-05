function checkIfHost() {
  const params = new URLSearchParams(window.location.search);
  return !(
    params.has("joinSharedSession") &&
    params.get("joinSharedSession") === "true"
  );
}

/*
 * Generate a random string of a specified length
 * @param   Int     The requested length of the random string
 * @return  String  A random string of a specified length
 */
function generateId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/*
 * Generate a random color and return its HEX value
 * https://stackoverflow.com/questions/67391525/javascript-generate-random-pastel-hex-rgba-color
 */
function generateRandomColor() {
  let R = Math.floor(Math.random() * 127 + 127);
  let G = Math.floor(Math.random() * 127 + 127);
  let B = Math.floor(Math.random() * 127 + 127);

  let rgb = (R << 16) + (G << 8) + B;
  return `#${rgb.toString(16)}`;
}

module.exports = { checkIfHost, generateId, generateRandomColor };
