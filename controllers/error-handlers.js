function finalErrorHandler(err, req, res, next) {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
}

function customErrorHandler(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

function psqlErrorHandler(err, req, res, next) {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Item not found" });
  } else {
    next(err);
  }
}

module.exports = { finalErrorHandler, customErrorHandler, psqlErrorHandler };
