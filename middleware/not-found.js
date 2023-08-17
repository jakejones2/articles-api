function notFound(_, res) {
  res.status(404).send({ msg: "Not found" });
}

module.exports = notFound;
