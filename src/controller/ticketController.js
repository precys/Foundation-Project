const express = require("express");
const router = express.Router();
const ticketService = require("../service/ticketService");
const { authenticateToken } = require("../util/jwt");
const multer = require("multer");

// added for parsing form-data like demo video
const upload = multer();








// submit ticket
router.post("/", authenticateToken, async (req, res) => {
    const { amount, description, type } = req.body;
    const author = req.user?.user_id;

    try {
        const ticket = await ticketService.submitTicket(author, amount, description, type);
        res.status(201).json({ message: "Ticket submitted", ticket });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});






// get tickets (employee or manager)
router.get("/", authenticateToken, async (req, res) => {
    const status = req.query.status;
    let tickets;

    if (req.user.role === "manager") {
        tickets = await ticketService.getAllTickets(status);
    } else {
        if (status) {
            tickets = await ticketService.getUserTicketsByStatus(req.user.user_id, status);
        } else {
            tickets = await ticketService.getUserTickets(req.user.user_id);
        }
    }

    res.json({ tickets });
});








// process ticket for manager only
router.put("/:ticketId", authenticateToken, upload.none(), async (req, res) => {
    if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Employees cannot process requests" });
    }

    const status = req.body?.status || req.body?.Status;
    if (!status || !["Approved", "Denied"].includes(status)) {
        return res.status(400).json({ message: "Invalid or missing status" });
    }

    try {
        const updated = await ticketService.processTicket(req.params.ticketId, status);
        res.json({ message: `Ticket ${status}`, ticket: updated });
    } catch (err) {
        console.error(err);

        if (err.message.startsWith("Ticket")) {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).json({ message: "Server error" });
    }
});









module.exports = router;
