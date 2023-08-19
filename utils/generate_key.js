require("crypto").randomBytes(64, function (err, buffer) {
  console.log(buffer.toString("hex"));
});
