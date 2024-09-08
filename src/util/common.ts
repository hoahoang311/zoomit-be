export const createResponse = <T>(statusCode: number, body: T) => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': '*', // Allow from anywhere
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
        body: JSON.stringify({ ...body, success: statusCode > 200 ? false : true }),
    };
};
