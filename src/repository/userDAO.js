const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const TableName = "users_table";
const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);











// create new user
async function createUser(user) {
    try {
        const command = new PutCommand({
            TableName,
            Item: user,
            ConditionExpression: "attribute_not_exists(username)"
        });
        await docClient.send(command);
        return user;
    } catch (err) {
        if (err.name === "ConditionalCheckFailedException") return null;
        logger.error("Error creating user:", err);
        throw err;
    }
}





// get user by username
async function getUserByUsername(username) {
    try {
        const command = new GetCommand({
            TableName,
            Key: { username }
        });
        const result = await docClient.send(command);
        return result.Item || null;
    } catch (err) {
        logger.error("Error querying user:", err);
        return null;
    }
}






module.exports = { createUser, getUserByUsername };
