import { APIGatewayProxyEvent } from 'aws-lambda';
import { createResponse } from '../util/common';

export const handler = async (e: APIGatewayProxyEvent) => {
    console.log('testing network', e);

    return createResponse(200, { success: true });
};
