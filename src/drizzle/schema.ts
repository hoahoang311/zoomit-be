import { relations, sql } from 'drizzle-orm';
import {
    serial,
    text,
    timestamp,
    pgTable,
    pgEnum,
    uniqueIndex,
    integer,
    varchar,
    boolean,
    uuid,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role_enum', ['admin', 'user', 'guest']);
export const artGenreEnum = pgEnum('art_genre_enum', ['Fine Art', 'Abstract', 'Fashion', 'Contemporary']);

export const user = pgTable(
    'user',
    {
        id: serial('id').primaryKey(),
        nickname: text('nickname'),
        email: varchar('email', { length: 256 }).notNull(),
        password: varchar('password', { length: 256 }).notNull(),
        role: userRoleEnum('role').default('user'),
        deviceId: varchar('device_id', { length: 256 }),
        isActive: boolean('is_active').default(true),
        createdAt: timestamp('created_at').default(sql`now()`), // Automatically set on creation
        updatedAt: timestamp('updated_at')
            .default(sql`now()`)
            .$onUpdate(() => sql`now()`), // Automatically update on modification
    },
    (user) => {
        return {
            emailIndex: uniqueIndex('email_idx').on(user.email),
            nicknameIndex: uniqueIndex('nickname_idx').on(user.nickname),
        };
    },
);

export const userProfile = pgTable(
    'user_profile',
    {
        id: serial('id').primaryKey(),
        phoneNumber: integer('phone_number').notNull(),
        avatar: varchar('avatar', { length: 256 }),
        userId: integer('user_id').references(() => user.id),
        firstName: varchar('first_name', { length: 256 }).notNull(),
        lastName: varchar('last_name', { length: 256 }).notNull(),
        city: varchar('city', { length: 256 }),
        state: varchar('state', { length: 256 }).notNull(),
        country: varchar('country', { length: 256 }).notNull(),
        artGenre: artGenreEnum('art_genre').notNull(),
        createdAt: timestamp('created_at').default(sql`now()`), // Automatically set on creation
        updatedAt: timestamp('updated_at')
            .default(sql`now()`)
            .$onUpdate(() => sql`now()`), // Automatically update on modification
    },
    (userProfile) => {
        return {
            phoneIndex: uniqueIndex('phone_idx').on(userProfile.phoneNumber),
        };
    },
);

export const post = pgTable(
    'post',
    {
        id: serial('id').primaryKey(),
        url: varchar('url', { length: 256 }),
        thumbnail: varchar('thumbnail', { length: 256 }),
        userId: integer('user_id').references(() => user.id),
        tags: text('tags')
            .array()
            .default(sql`ARRAY[]::text[]`),
        description: text('description'),
        liked: integer('liked').default(0),
        views: integer('views').default(0),
        votes: integer('votes').default(0),
        createdAt: timestamp('created_at').default(sql`now()`), // Automatically set on creation
        updatedAt: timestamp('updated_at')
            .default(sql`now()`)
            .$onUpdate(() => sql`now()`), // Automatically update on modification
    },
    (post) => {
        return {
            urlIndex: uniqueIndex('url_idx').on(post.url),
        };
    },
);

export const refreshToken = pgTable('refresh_token', {
    id: uuid('id').defaultRandom().primaryKey(),
    hashedToken: varchar('hashed_token', { length: 256 }),
    userId: integer('user_id').references(() => user.id),
    revoked: boolean('revoked').default(false),
    createdAt: timestamp('created_at').default(sql`now()`), // Automatically set on creation
    updatedAt: timestamp('updated_at')
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`), // Automatically update on modification
});

export const comment = pgTable('comment', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => user.id),
    postId: integer('post_id').references(() => post.id),
    content: text('content'),
    createdAt: timestamp('created_at').default(sql`now()`), // Automatically set on creation
    updatedAt: timestamp('updated_at')
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`), // Automatically update on modification
});

// User relations
export const userRelations = relations(user, ({ one, many }) => ({
    profile: one(userProfile, {
        fields: [user.id],
        references: [userProfile.userId],
    }),
    posts: many(post),
    refreshTokens: many(refreshToken),
    comments: many(comment),
}));

// Post relations
export const postRelations = relations(post, ({ one, many }) => ({
    user: one(user, {
        fields: [post.userId],
        references: [user.id],
    }),
    comments: many(comment),
}));

// Comment relations
export const commentRelations = relations(comment, ({ one }) => ({
    user: one(user, {
        fields: [comment.userId],
        references: [user.id],
    }),
    post: one(post, {
        fields: [comment.postId],
        references: [post.id],
    }),
}));

// Token relations
export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
    user: one(user, {
        fields: [refreshToken.userId],
        references: [user.id],
    }),
}));
