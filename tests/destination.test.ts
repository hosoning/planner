import test from 'node:test';
import assert from 'node:assert/strict';
import {drawDestination,chinaDestinations} from '../lib/tarot/destination';

test('destination reading draws three distinct physical RWS cards before matching a city',()=>{
 const reading=drawDestination();
 assert.equal(reading.cards.length,3);
 assert.equal(new Set(reading.cards.map(c=>c.id)).size,3);
 assert.ok(reading.cards.every(c=>c.orientation==='upright'||c.orientation==='reversed'));
 assert.ok(chinaDestinations.some(c=>c.id===reading.destination.id));
 assert.equal(reading.destination.dataStatus,'provider_required');
 assert.ok(reading.rationale.includes('抽牌后按预先定义'));
});
