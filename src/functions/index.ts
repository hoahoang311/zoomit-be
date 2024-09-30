import { APIGatewayProxyEvent } from 'aws-lambda';
import { createResponse } from '../util/common';

export const handler = async (e: APIGatewayProxyEvent) => {
    try {
        const res = await fetch('https://66hunpjaub.execute-api.ca-central-1.amazonaws.com/Prod', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        console.log(res);
        console.log(e);

        return createResponse(200, { success: true, message: res });
    } catch (err: any) {
        return createResponse(500, { success: false, message: err.message });
    }
};
