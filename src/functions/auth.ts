import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../util/common';
import zodSchema from '../zod';
import bcrypt from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';
import { createNewUser, getUserByEmail, getUserById, getUserByNickname } from '../datasource/user';
import { errors } from '../util/constant';
import { generateTokens, hashToken } from '../util/token';
import { addRefreshTokenToWhiteList, deleteRefreshToken, findRefreshTokenById } from '../datasource/auth';
import { hashPassword } from '../util/auth';
import jwt from 'jsonwebtoken';
import { getEnv } from '../util/env';

export const loginHandler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!e.body) {
            return createResponse(400, { message: 'request body is missing' });
        }

        const body = JSON.parse(e.body);

        const { success, data, error } = zodSchema.auth.loginSchema.safeParse(body);

        // Type check false
        if (!success) {
            return createResponse(400, { message: error.message });
        }

        const user = await getUserByEmail(data.email);

        // No user found
        if (!user) {
            return createResponse(400, { message: errors.noAccount });
        }

        const { password, id } = user;
        const isPasswordValid = await bcrypt.compare(data.password, password);

        // Invalid Password
        if (!isPasswordValid) {
            return createResponse(400, { message: errors.invalidPassword });
        }

        const tokenId = uuidV4();
        const { accessToken, refreshToken } = generateTokens(id, tokenId);
        await addRefreshTokenToWhiteList({
            refreshToken,
            tokenId,
            userId: user.id,
        });

        return createResponse(200, {
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (err: any) {
        console.log(err);
        return createResponse(500, { message: err.message });
    }
};

export const signupHandler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!e.body) {
            return createResponse(400, { message: 'request body is missing' });
        }

        const body = JSON.parse(e.body);

        const { success, data, error } = zodSchema.auth.signupSchema.safeParse(body);

        // Type check false
        if (!success) {
            return createResponse(400, { message: error.message });
        }

        const user = await getUserByEmail(data.email);

        // if user found
        if (user) {
            return createResponse(400, { message: errors.accountExist });
        }

        const userByNickname = await getUserByNickname(data.nickname);

        // if user found
        if (userByNickname) {
            return createResponse(400, { message: errors.accountExist });
        }

        const hashedPassword = await hashPassword(data.password);
        const savedUser = await createNewUser({ ...data, password: hashedPassword });

        return createResponse(200, {
            data: savedUser,
        });
    } catch (err: any) {
        console.log(err);
        return createResponse(500, { message: err.message });
    }
};

export const refreshTokenHandler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!e.body) {
            return createResponse(400, { message: 'request body is missing' });
        }

        const { refreshToken } = JSON.parse(e.body);

        const payload = jwt.verify(refreshToken, getEnv('JWT_REFRESH_SECRET') || '') as any;

        const savedRefreshToken = await findRefreshTokenById(payload.tokenId);

        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            createResponse(401, { message: errors.invalidToken });
        }

        const hashedToken = hashToken(refreshToken);

        if (hashedToken !== savedRefreshToken.hashedToken) {
            createResponse(401, { message: errors.invalidToken });
        }

        const user = await getUserById(payload.userId);
        if (!user) {
            createResponse(401, { message: errors.noAccount });
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const tokenId = uuidV4();
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, tokenId);

        await addRefreshTokenToWhiteList({
            tokenId,
            refreshToken: newRefreshToken,
            userId: user.id,
        });

        return createResponse(200, {
            data: {
                accessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (err: any) {
        console.log(err);
        return createResponse(500, { message: err.message });
    }
};

export const nicknameHandler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!e.body) {
            return createResponse(400, { message: 'request body is missing' });
        }

        const body = JSON.parse(e.body);
        const { success, data, error } = zodSchema.auth.nicknameSchema.safeParse(body);

        // Type check false
        if (!success) {
            return createResponse(400, { message: error.message });
        }

        const user = await getUserByNickname(data.nickname);
        if (user) {
            return createResponse(400, { message: errors.accountExist });
        }

        return createResponse(200, { data: null });
    } catch (err: any) {
        console.log(err);
        return createResponse(500, { message: err.message });
    }
};
