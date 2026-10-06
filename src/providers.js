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
].map(([slug,name,icon,art])=>({id:slug,name,icon,art,provider:'Pragmatic Play',url:`https://www.pragmaticplay.com/en/games/${slug}/?cur=USD&gamelang=en`}));
