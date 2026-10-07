'use client';
import {useEffect,useRef} from 'react';
let locks=0;
let savedOverflow='';
/** Handle only the top dialog; nested dialogs share one scroll lock. */
export default function useModal(open:boolean|string,close:()=>void){
 const closeRef=useRef(close);
 useEffect(()=>{closeRef.current=close},[close]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement as HTMLElement|null;
  if(locks++===0){savedOverflow=document.body.style.overflow;document.body.style.overflow='hidden'}
  const dialogs=document.querySelectorAll<HTMLElement>('.modalBackdrop');
  const dialog=dialogs[dialogs.length-1];
  const nodes=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex="0"]')||[]).filter(el=>el.getClientRects().length>0);
  const frame=requestAnimationFrame(()=>nodes()[0]?.focus());
  const onKey=(event:KeyboardEvent)=>{
   const all=document.querySelectorAll('.modalBackdrop');
   if(all[all.length-1]!==dialog)return;
   if(event.key==='Escape'){event.preventDefault();closeRef.current()}
   if(event.key==='Tab'){
    const list=nodes(),first=list[0],last=list[list.length-1];if(!first)return;
    if(!dialog.contains(document.activeElement)){event.preventDefault();first.focus()}
    else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',onKey);
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',onKey);if(--locks===0)document.body.style.overflow=savedOverflow;if(previous?.isConnected)previous.focus()};
 },[open]);
}
