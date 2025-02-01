import TicketModel from "../models/ticket.models..js";

class TicketDAO {
  async create(ticket) {
    return await TicketModel.create(ticket);
  }
}

export default new TicketDAO();
