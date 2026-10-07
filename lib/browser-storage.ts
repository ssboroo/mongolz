/** Browsers may disable storage or contain stale/corrupt values. UI must still work. */
export function readStorage(key:string){try{return typeof window==='undefined'?null:window.localStorage.getItem(key)}catch{return null}}
export function writeStorage(key:string,value:string){try{window.localStorage.setItem(key,value);return true}catch{return false}}
export function removeStorage(key:string){try{window.localStorage.removeItem(key)}catch{}}
export function isDemoUser(value:unknown):value is {id:string;username:string;email:string;createdAt:string}{
 if(!value||typeof value!=='object')return false;
 const user=value as Record<string,unknown>;
 return ['id','username','email','createdAt'].every(key=>typeof user[key]==='string'&&String(user[key]).length>0);
}
