import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate access token for user login
 *
 * @param userId
 * @returns
 */
export const generateAccessToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET || '', {
        expiresIn: '5h',
    });
};

/**
 * Generate Refresh token for user login
 *
 * @param userId
 * @param tokenId
 * @returns
 */
export const generateRefreshToken = (userId: number, tokenId: string) => {
    return jwt.sign(
        {
            userId,
            tokenId,
        },
        process.env.JWT_REFRESH_SECRET || '',
        {
            expiresIn: '1d',
        },
    );
};

/**
 * Generate token for FE return accessToken & refreshToken
 *
 * @param userId
 * @param tokenId
 * @returns
 */
export const generateTokens = (userId: number, tokenId: string) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId, tokenId);

    return {
        accessToken,
        refreshToken,
    };
};

export const hashToken = (token: string) => crypto.createHash('sha512').update(token).digest('hex');
