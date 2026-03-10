const pool = require("../config/database");

//Muda os nomes dos campos para que fique salvo no DB
function mapToDatabase(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: body.items.map((item) => ({
      productId: item.idItem,
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

//criando um novo pedido
async function createOrder(body) {
  console.log("Body recebido:", body);
  console.log("Order mapeado:", mapToDatabase(body));
  const order = mapToDatabase(body);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO orders (order_id, value, creation_date) VALUES($1, $2, $3)",
      [order.orderId, order.value, order.creationDate],
    );

    for (const item of order.items) {
      await client.query(
        "INSERT INTO items (order_id, product_id, quantity, price) VALUES($1, $2, $3, $4)",
        [order.orderId, item.productId, item.quantity, item.price],
      );
    }

    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getOrder(orderId) {
  //vai buscar o pedido
  const orderResult = await pool.query(
    "SELECT order_id, value, creation_date FROM orders WHERE order_id = $1",
    [orderId],
  );

  //caso não encontre o pedido retorna null
  if (orderResult.rows.length === 0) {
    return null;
  }

  //busca os itens do pedido
  const itemsResult = await pool.query(
    "SELECT product_id, quantity, price FROM items WHERE order_id = $1",
    [orderId],
  );

  //Monta e retorna o pediddo
  const order = orderResult.rows[0];
  return {
    orderId: order.order_id,
    value: order.value,
    creationDate: order.creation_date,
    items: itemsResult.rows.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

//Lista os pedidos
async function listOrders() {
  //vai buscar todos os pedidos
  const ordersResult = await pool.query(
    "SELECT order_id, value, creation_date FROM orders",
  );

  //Se não tiver pedido retorna null
  if (ordersResult.rows.length === 0) {
    return [];
  }

  //Busca os itens de cada pedido
  const orders = await Promise.all(
    ordersResult.rows.map(async (order) => {
      const itemsResult = await pool.query(
        "SELECT product_id, quantity, price FROM items WHERE order_id = $1",
        [order.order_id],
      );
      return {
        orderId: order.order_id,
        value: order.value,
        creationDate: order.creation_date,
        items: itemsResult.rows.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    }),
  );

  return orders;
}

//função para atualizar um pedido
async function updateOrder(orderId, body) {
  const order = mapToDatabase(body);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //Verifica se o pedido existe
    const orderExists = await client.query(
      `SELECT order_id FROM orders WHERE order_id = $1`,
      [orderId],
    );

    if (orderExists.rows.length === 0) {
      return null;
    }

    // Atualiza o pedido
    await client.query(
      `UPDATE orders SET value = $1, creation_date = $2
       WHERE order_id = $3`,
      [order.value, order.creationDate, orderId],
    );

    // Deleta os itens antigos
    await client.query(`DELETE FROM items WHERE order_id = $1`, [orderId]);

    // Insere os novos itens
    for (const item of order.items) {
      await client.query(
        `INSERT INTO items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price],
      );
    }

    await client.query("COMMIT");
    return { orderId, ...order };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

//Deletar um pedido
async function deleteOrder(orderId) {
  const result = await pool.query(
    `DELETE FROM orders WHERE order_id = $1 RETURNING order_id`,
    [orderId],
  );

  // Se não encontrou o pedido, retorna null
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
};
