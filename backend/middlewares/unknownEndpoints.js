module.exports = (request, response) => {
  response.status(404).json({ error: "Unknown endpoint" });
};
