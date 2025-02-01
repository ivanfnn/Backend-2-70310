import express from "express";
import { authorizeUser } from "../middlewares/authorization.js";
import CartDAO from "../dao/CartDAO.js";
import TicketDAO from "../dao/ticket.dao..js";

const router = express.Router();


const generateUniqueCode = () => `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

router.post("/:cid/purchase", authorizeUser, async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartDAO.getCartById(cid);
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    const ticket = await TicketDAO.create({
      code: generateUniqueCode(), 
      amount: cart.total,
      purchaser: req.user.email,
    });

    res.send({ status: "success", ticket });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
