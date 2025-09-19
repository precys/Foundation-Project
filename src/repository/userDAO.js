const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const TableName = "users_table";
const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);




// aws dynamodb create-table \
//   --table-name users_table \
//   --attribute-definitions AttributeName=username,AttributeType=S \
//   --key-schema AttributeName=username,KeyType=HASH \
//   --billing-mode PAY_PER_REQUEST



// // ensure table exists
// async function ensureTableExists() {
//     try {
//         const desc = await client.send(new DescribeTableCommand({ TableName }));
//         if (desc.Table.TableStatus !== "ACTIVE") {
//             logger.info("Waiting for users table to become ACTIVE...");
//             await waitForTableActive();
//         } else {
//             logger.info("Users table exists:", TableName);
//         }
//     } catch (err) {
//         if (err.name === "ResourceNotFoundException") {
//             logger.info("Creating users table:", TableName);
//             const params = {
//                 TableName,
//                 KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
//                 AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
//                 BillingMode: "PAY_PER_REQUEST"
//             };
//             await client.send(new CreateTableCommand(params));
//             logger.info("Users table created, waiting to become ACTIVE...");
//             await waitForTableActive();
//         } else {
//             logger.error(err);
//             throw err;
//         }
//     }
// }



// // check that table is active to use
// async function waitForTableActive() {
//     let retries = 20;
//     while (retries > 0) {
//         const desc = await client.send(new DescribeTableCommand({ TableName }));
//         if (desc.Table.TableStatus === "ACTIVE") return;
//         await new Promise(r => setTimeout(r, 1000));
//         retries--;
//     }
//     throw new Error(`Table ${TableName} did not become ACTIVE in time`);
// }











// create new user
async function createUser(user) {
    //await ensureTableExists();
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
    //await ensureTableExists();
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
