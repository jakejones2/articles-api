const bcrypt = require("bcrypt");

function genRandomString(length) {
  var chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  var charLength = chars.length;
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

bcrypt.genSalt(10, (err, salt) => {
  const pswd = genRandomString(8);
  console.log("pswd: ", pswd);
  console.log("salt: ", salt);
  bcrypt.hash(pswd, salt, (err, hash) => {
    console.log("hash: ", hash);
  });
});
