function notFound(_, res) {
  res.status(404).send({ msg: "Endpoint not found" });
}

module.exports = notFound;
