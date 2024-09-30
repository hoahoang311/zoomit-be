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

        const parsed = await res.json();

        console.log(parsed);
        console.log(e);

        return createResponse(200, { success: true, message: parsed });
    } catch (err: any) {
        return createResponse(500, { success: false, message: err.message });
    }
};
