import type {CSSProperties} from 'react';
const paths:Record<string,string>={
 home:'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
 diamond:'m3 8 5-5h8l5 5-9 13L3 8Zm0 0h18M8 3l4 18 4-18',
 live:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-6V8l7 4-7 4Z',
 grid:'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
 spade:'M12 3c-2 4-9 6-9 11a4 4 0 0 0 7 2l-1 5h6l-1-5a4 4 0 0 0 7-2c0-5-7-7-9-11Z',
 layers:'m12 3 10 6-10 6L2 9l10-6ZM2 14l10 6 10-6M2 19l10 6 10-6',
 gift:'M3 8h18v4H3V8Zm2 4v9h14v-9M12 8v13M12 8H7a3 3 0 1 1 3-3l2 3Zm0 0h5a3 3 0 1 0-3-3l-2 3Z',
 crown:'m3 6 5 5 4-8 4 8 5-5-2 14H5L3 6Zm3 11h12',
 history:'M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v6l4 2',
 shield:'m12 2 9 4v6c0 5-4 8-9 10-5-2-9-5-9-10V6l9-4Zm-5 10 3 3 7-7',
 bolt:'m13 2-9 12h7l-1 8 10-13h-7l1-7',
 fire:'M13 2c3 7-3 7 2 12 2-1 3-3 3-5 7 10 1 13-6 13S2 16 5 10c0 5 4 5 4 2 0-4 4-5 4-10Z',
 phone:'M7 2h10v20H7V2Zm3 17h4',
 search:'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm6-2 6 6',
 bell:'M18 8a6 6 0 0 0-12 0v7l-3 3h18l-3-3V8Zm-8 13h4',
 chevron:'m9 5 7 7-7 7',
 trophy:'M7 3h10v6a5 5 0 0 1-10 0V3Zm10 2h4v3c0 3-2 5-5 5M7 5H3v3c0 3 2 5 5 5M12 14v7M7 21h10',
 wallet:'M3 5h15v4H3V5Zm0 4h18v12H3V9Zm13 4h5v4h-5v-4'
};
const aliases:Record<string,string>={'⌂':'home','♢':'diamond','◉':'live','▦':'grid','♠':'spade','▱':'layers','🎁':'gift','♛':'crown','◷':'history','⬡':'shield','ϟ':'bolt','🔥':'fire','♨':'fire','♟':'live','⌕':'search','M':'crown'};
export default function Icon({name,className,style}:{name:string;className?:string;style?:CSSProperties}){return <svg className={className} style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[aliases[name]||name]||paths.diamond}/></svg>}
