function errorHandler(err, req, res, next) {
  console.error("❌ Erro:", err.message);

  // Erro de chave duplicada no banco (pedido já existe)
  if (err.code === "23505") {
    return res.status(409).json({
      error: "Pedido já existe com esse número.",
    });
  }

  // Erro genérico
  return res.status(500).json({
    error: "Erro interno no servidor.",
  });
}

module.exports = errorHandler;
