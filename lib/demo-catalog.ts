import catalog from './public-catalog.json';
import {games} from './games';
export type PublicGame={id:string;name:string;provider:string;category:string;kind?:string;url?:string;icon?:string;originalId?:string;mnName?:string;enName?:string};

const PUBLIC=(catalog as {games:PublicGame[]}).games;

// Reference lobby tiles are illustrative artwork; launches remain local simulations.
const referenceGames=(names:string[],prefix:string):PublicGame[]=>names.map((name,i)=>({id:prefix+i,name,provider:'MONGOLZ Demo',category:'slots',kind:'local',url:'/royal/hd/'+prefix+i+'.webp'}));
export const POPULAR=referenceGames(['Sweet Fantasy','Gates of Olympus','Big Bass Adventure',"Dragon’s Treasure",'Queen of the Nile','Lucky Paws','Sugar Rush 1000','Wild Buffalo','Book of Kings','Fruit Party'],'popular-');
export const HERO=POPULAR.slice(0,6);
export const NEW_GAMES=referenceGames(['Crystal Wolves','Temple of Fortuna','Panda Fortune','Golden Bull','Divine Queen','Wild West','Dragon Fire','Lucky Cat','Samurai Fortune','Mystic Sorceress'],'new-');
const originals:PublicGame[]=games.map(g=>({id:'original-'+g.id,name:g.en,mnName:g.mn,enName:g.en,provider:'MONGOLZ Demo',category:g.category==='Slots'?'slots':g.category==='Table'?'table':'instant',kind:'local',originalId:g.id,icon:g.icon}));
export const catalogGames=[...POPULAR,...NEW_GAMES,...originals,...PUBLIC];
