import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const gameProgress = sqliteTable('game_progress', {
  userId: text('user_id').primaryKey(),
  saveJson: text('save_json').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: integer('updated_at').notNull(),
});

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  loginKey: text('login_key').notNull().unique(),
  displayName: text('display_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  recoveryHash: text('recovery_hash').notNull(),
  createdAt: integer('created_at').notNull(),
});
export const accountSessions = sqliteTable('account_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  accountId: text('account_id').notNull().references(()=>accounts.id),
  expiresAt: integer('expires_at').notNull(),
});
export const authLimits = sqliteTable('auth_limits', {
  key: text('key').primaryKey(),
  attempts: integer('attempts').notNull(),
  windowStart: integer('window_start').notNull(),
});
