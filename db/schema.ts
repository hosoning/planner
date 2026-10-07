import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const rounds=sqliteTable('rounds',{id:text('id').primaryKey(),sessionId:text('session_id').notNull(),snapshot:text('snapshot').notNull(),salt:text('salt').notNull(),commitment:text('commitment').notNull(),status:text('status').notNull(),answer:text('answer'),createdAt:integer('created_at').notNull(),expiresAt:integer('expires_at').notNull(),planningUntil:integer('planning_until').notNull().default(0)},t=>[index('round_session').on(t.sessionId)]);
export const usage=sqliteTable('usage',{bucket:text('bucket').primaryKey(),count:integer('count').notNull()});

export const itineraries=sqliteTable('itineraries',{roundId:text('round_id').primaryKey(),sessionId:text('session_id').notNull(),plan:text('plan').notNull(),revealed:integer('revealed').notNull().default(0),createdAt:integer('created_at').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('itinerary_session').on(t.sessionId)]);
