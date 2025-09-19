const ticketDAO = require("../repository/ticketDAO");
const { logger } = require("../util/logger");







// submit new ticket
async function submitTicket(author, amount, description, type) {
    if (!author) throw new Error("User not authenticated properly");
    if (!amount) throw new Error("Missing amount! Please enter a valid amount");
    if (!description) throw new Error("Missing description");
    if (!type) throw new Error("Missing type");

    const amountStr = amount.toString();
    const validAmount = /^\d+(\.\d{1,2})?$/.test(amountStr);
    if (!validAmount) {
        throw new Error("Amount must be a number with a max of 2 decimal places if needed");
    }

    let decimalAmount = amountStr;
    if (!amountStr.includes(".")) {
        decimalAmount = amountStr + ".00";
    } else {
        const [whole, decimal] = amountStr.split(".");
        decimalAmount = whole + "." + decimal.padEnd(2, "0");
    }

    const ticket = {
        //id: undefined,
        author,
        amount: decimalAmount,
        description,
        type,
        status: "Pending",
        submitted_at: new Date().toISOString(),
    };

    return await ticketDAO.createTicket(ticket);
}











// get user tickets by status
async function getUserTicketsByStatus(author, status) {
    return await ticketDAO.getTicketsByUserAndStatus(author, status);
}







// get user tickets
async function getUserTickets(author) {
    return await ticketDAO.getTicketsByUser(author);
}








// get all tickets for manager use
async function getAllTickets(status) {
    return await ticketDAO.getAllTickets(status);
}









// process ticket with approved or denied for manager use
async function processTicket(ticketId, status) {
    if (!["Approved", "Denied"].includes(status)) {
        throw new Error("Invalid status");
    }

    const ticket = await ticketDAO.getTicketById(ticketId);
    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (ticket.status === "Approved") {
        if (status === "Approved") {
            throw new Error("Ticket has already been Approved");
        } else if (status === "Denied") {
            throw new Error("Ticket has already been Approved and cannot be Denied");
        }
    }

    if (ticket.status === "Denied") {
        if (status === "Denied") {
            throw new Error("Ticket has already been Denied");
        } else if (status === "Approved") {
            throw new Error("Ticket has already been Denied and cannot be Approved");
        }
    }

    return await ticketDAO.updateTicketStatus(ticketId, status);
}
















module.exports = { submitTicket, getUserTickets, getUserTicketsByStatus, getAllTickets, processTicket };
