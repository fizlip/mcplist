import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = "spekter-index";
    const limit = 1000;
    const lastEvaluatedKey = searchParams.get('lastKey') ? JSON.parse(searchParams.get('lastKey')!) : undefined;

    // Basic scan parameters
    const scanParams: {
      TableName: string;
      Limit?: number;
      ExclusiveStartKey?: Record<string, string | number | boolean>;
      FilterExpression?: string;
      ExpressionAttributeValues?: Record<string, string | number | boolean>;
    } = {
      TableName: tableName,
    };

    // Add optional parameters
    if (limit) {
      scanParams.Limit = limit;
    }

    if (lastEvaluatedKey) {
      scanParams.ExclusiveStartKey = lastEvaluatedKey;
    }

    // Optional: Add filter expression
    // const filterExpression = searchParams.get('filter');
    // if (filterExpression) {
    //   scanParams.FilterExpression = filterExpression;
    //   
    //   // Example: If you want to filter by attribute values
    //   // scanParams.ExpressionAttributeValues = {
    //   //   ':value': 'some-value'
    //   // };
    // }

    // Execute the scan
    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    return Response.json({
      servers: result.Items || [],
      metadata: {
        next_cursor: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : '',
        count: result.Count || 0,
        scannedCount: result.ScannedCount || 0,
        hasMore: !!result.LastEvaluatedKey
      }
    });

  } catch (error) {
    console.error('Error scanning DynamoDB table:', error);
    return Response.json({ 
      error: 'Failed to scan table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
  