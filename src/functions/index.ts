import { APIGatewayProxyEvent } from 'aws-lambda';
import { createResponse } from '../util/common';

export const handler = async (e: APIGatewayProxyEvent) => {
    const res = await fetch('https://66hunpjaub.execute-api.ca-central-1.amazonaws.com/Prod');

    console.log(res);

    return createResponse(200, { success: true, message: res });
};
