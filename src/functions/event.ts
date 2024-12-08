import { APIGatewayProxyEvent } from 'aws-lambda';
import { createResponse } from '../util/common';

export const handler = async (e: APIGatewayProxyEvent) => {
    try {
        console.log(e)

        return createResponse(200, { success: true, message: "db records" });
    } catch (err: any) {
        return createResponse(500, { success: false, message: err.message });
    }
};
