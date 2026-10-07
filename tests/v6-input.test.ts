import {it} from 'node:test';
import assert from 'node:assert/strict';
import {validateTrip} from '../lib/tarot/core';

const base={city:'Vancouver',date:'2026-10-08',start:0,end:1439,budget:18000,currency:'CAD',mode:'live',timezone:'America/Vancouver'};

it('accepts a name-free full-day window and an optional keepsake nickname',()=>{
 const trip=validateTrip({...base,allDay:true});
 assert.equal(trip.start,0);
 assert.equal(trip.end,1439);
 assert.equal(trip.userName,undefined);
 assert.equal(validateTrip({...base,userName:'V'}).userName,'V');
});

it('accepts a birthday plan that crosses midnight for up to 48 hours',()=>{
 const trip=validateTrip({...base,start:0,end:2879,allDay:true});
 assert.equal(trip.end-trip.start,2879);
 assert.throws(()=>validateTrip({...base,start:0,end:2881}));
});
