const express = require('express'); 
const { loggerMiddleware } = require('./util/logger');

const userController = require('./controller/userController'); 
const ticketController = require('./controller/ticketController'); 

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
