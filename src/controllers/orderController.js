const orderService = require("../services/orderService");

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    next(error); // passa o erro para o errorHandler
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrder(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders();
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    const order = await orderService.updateOrder(req.params.orderId, req.body);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const order = await orderService.deleteOrder(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    return res.status(200).json({ message: "Pedido deletado com sucesso." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
};
