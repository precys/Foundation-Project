const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");
const { v4: uuidv4 } = require("uuid");

const TicketTable = "tickets_table";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);








// create ticket
async function createTicket(ticket) {
    ticket.id = uuidv4();
    await docClient.send(new PutCommand({ TableName: TicketTable, Item: ticket }));
    return ticket;
}







// get tickets by user and status
async function getTicketsByUserAndStatus(author, status) {
    const params = {
        TableName: TicketTable,
        FilterExpression: "#a = :a AND #s = :s",
        ExpressionAttributeNames: { "#a": "author", "#s": "status" },
        ExpressionAttributeValues: { ":a": author, ":s": status }
    };
    const data = await docClient.send(new ScanCommand(params));
    return data.Items || [];
}






// get a single ticket by ID for manager processing
async function getTicketById(ticketId) {
    const params = {
        TableName: TicketTable,
        Key: { id: ticketId }
    };

    try {
        const data = await docClient.send(new GetCommand(params));
        return data.Item || null;
    } catch (err) {
        logger.error("Error fetching ticket by ID:", err);
        return null;
    }
}











// get all ticket submissions by user
async function getTicketsByUser(author) {
    const params = {
        TableName: TicketTable,
        FilterExpression: "#a = :a",
        ExpressionAttributeNames: { "#a": "author" },
        ExpressionAttributeValues: { ":a": author }
    };
    const data = await docClient.send(new ScanCommand(params));
    return data.Items || [];
}








// get all tickets
async function getAllTickets(status) {
    let params = { TableName: TicketTable };
    if (status) {
        params.FilterExpression = "#s = :s";
        params.ExpressionAttributeNames = { "#s": "status" };
        params.ExpressionAttributeValues = { ":s": status };
    }
    const data = await docClient.send(new ScanCommand(params));
    return data.Items || [];
}









// update ticket status
async function updateTicketStatus(ticketId, status) {
    const data = await docClient.send(new UpdateCommand({
        TableName: TicketTable,
        Key: { id: ticketId },
        UpdateExpression: "SET #s = :s",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":s": status },
        ReturnValues: "ALL_NEW"
    }));
    return data.Attributes;
}








module.exports = { createTicket, getTicketsByUser, getTicketById, getAllTickets, updateTicketStatus, getTicketsByUserAndStatus };
