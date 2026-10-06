/** Local, generated illustration assets. These do not represent licensed provider game artwork. */
export function artworkFor(game:{id:string;name:string;category:string}){
 const name=game.name.toLowerCase();
 if(game.category==='live'||game.category==='table'){
  const index=/roulette/.test(name)?0:/blackjack|21/.test(name)?1:/baccarat/.test(name)?2:3;
  return `/royal/hd/live-${index}.webp`;
 }
 const themes:[RegExp,string][]=[[/sweet|bonanza|candy|sugar/,'popular-0'],[/olympus|zeus|god/,'popular-1'],[/bass|fish|sea|pelican/,'popular-2'],[/dragon|fire/,'popular-3'],[/queen|egypt|nile|cleopatra/,'popular-4'],[/dog|paws/,'popular-5'],[/rush|gum/,'popular-6'],[/buffalo|bull/,'popular-7'],[/book|pharaoh|king/,'popular-8'],[/fruit/,'popular-9'],[/wolf|ice|crystal/,'new-0'],[/temple|fortuna/,'new-1'],[/panda/,'new-2'],[/cat/,'new-7'],[/samurai/,'new-8'],[/witch|coven|magic|freya/,'new-9'],[/west|cowboy/,'new-5']];
 const theme=themes.find(([pattern])=>pattern.test(name));
 const hash=[...game.id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);
 return `/royal/hd/${theme?.[1]||'new-'+hash%10}.webp`;
}
