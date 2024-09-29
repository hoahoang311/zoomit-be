import { APIGatewayProxyEvent } from 'aws-lambda';
import { createResponse } from '../util/common';

export const handler = async (e: APIGatewayProxyEvent) => {
    return createResponse(200, { success: true, message: 'Hello World' });
};
