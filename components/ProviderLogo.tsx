import Icon from './Icon';
export default function ProviderLogo({name}:{name:string}){
 const n=name.replace(' Gaming','').replace(' Live','');
 return <span className={'studioWordmark studio-'+n.toLowerCase().replace(/[^a-z]/g,'')} aria-label={name}>
 {n==='Pragmatic Play'?<><span>PRAGMATIC</span><Icon name="crown"/><b>PLAY</b></>:n==='PG Soft'?<><b>PG</b><small>POCKET<br/>GAMES SOFT</small></>:n==='Hacksaw'?<b>HACKSAW<small>G A M I N G</small></b>:n==='Play’n GO'?<b>Play’n <em>GO</em></b>:<b>{n}</b>}
 </span>
}
