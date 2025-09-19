const express = require('express'); // Import Express to handle HTTP requests
const { loggerMiddleware } = require('./util/logger'); // Custom logger for requests

const userController = require('./controller/userController'); // User routes
const ticketController = require('./controller/ticketController'); // Ticket routes

const app = express();
const PORT = 3000;

// middleware to parse JSON requests
app.use(express.json());

// middleware to parse form-data
app.use(express.urlencoded({ extended: true }));




// custom logger middleware to log every request
app.use(loggerMiddleware);



// routes
app.use("/", userController);
app.use("/tickets", ticketController);


// root route
app.get("/", (req, res) => {
    res.send("Reimbursement App");
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
