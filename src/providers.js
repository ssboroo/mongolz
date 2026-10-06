import { extraGames, evolutionSlots } from './public-catalog.js';
// Official public demo destinations, verified 2026-10-06. These are external
// provider pages, not an embedded distribution license or wallet integration.
export const publicDemos = [
 ['gates-of-olympus-2500','Gates of Olympus 2500','ϟ','slot-art'],
 ['pelican-payday','Pelican Payday','✦','dice-art'],
 ['deep-sea-frenzy','Deep Sea Frenzy','◈','card-art'],
 ['forever-split-megaways','Forever Split Megaways','♠','mine-art'],
 ['big-bass-vegas-1000','Big Bass Vegas 1000','✧','crash-art'],
 ['freya-1000','Freya 1000','◆','roulette-art'],
 ['coven-rising','Coven Rising','☽','mine-art']
].map(([slug,name,icon,art])=>({id:slug,name,icon,art,provider:'Pragmatic Play',category:'slots',kind:'demo-page',url:`https://www.pragmaticplay.com/en/games/${slug}/?cur=USD&gamelang=en`}));

export const publicCatalog=[...publicDemos,...extraGames,...evolutionSlots];
export const providerHubs=[
 {name:'Evolution',category:'live',url:'https://games.evolution.com/live-casino/'},
 {name:'Pragmatic Play Live',category:'live',url:'https://www.pragmaticplay.com/en/live-casino/'},
 {name:'Pragmatic Play',category:'slots',url:'https://www.pragmaticplay.com/en/games/?type=demo'},
 {name:'Hacksaw Gaming',category:'slots',url:'https://www.hacksawgaming.com/games'},
 {name:'Play’n GO',category:'slots',url:'https://www.playngo.com/games'},
 {name:'PG Soft',category:'slots',url:'https://www.pgsoft.com/en/games/'},
 {name:'BGaming',category:'slots',url:'https://bgaming.com/games'},
 {name:'NetEnt · Red Tiger · Nolimit City · Big Time Gaming',category:'slots',url:'https://games.evolution.com/slots/'}
];
