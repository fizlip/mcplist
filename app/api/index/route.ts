import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  // Credentials will be automatically loaded from:
  // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
  // 2. IAM roles (if running on EC2/Lambda)
  // 3. AWS credentials file (~/.aws/credentials)
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = "spekter-index";
    const limit = 1000;
    const lastEvaluatedKey = searchParams.get('lastKey') ? JSON.parse(searchParams.get('lastKey')!) : undefined;

    // Basic scan parameters
    const scanParams: any = {
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
  