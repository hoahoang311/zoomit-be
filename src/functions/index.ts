import { APIGatewayProxyEvent } from 'aws-lambda';

export const handler = async (e: APIGatewayProxyEvent) => {
    console.log(process.env);

    return {
        statusCode: 200,
        body: {
            data: JSON.stringify({ success: true }),
        },
    };
};
