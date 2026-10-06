export type ProviderGame = {id:string;name:string;provider:string;category:string;demoSupported:boolean;image:string|null};
export function credentials(env?:Record<string,string|undefined>):boolean;
export function normalizeGames(response:unknown):ProviderGame[];
export function launchUrl(value:string):string;
export function createProvider(options?:{env?:Record<string,string|undefined>;request?:typeof fetch}):{catalog():Promise<ProviderGame[]>;launch(id:string,device?:string,homeurl?:string):Promise<string>};
