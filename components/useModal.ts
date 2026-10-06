'use client';
import {useEffect} from 'react';
/** Lock scrolling, restore focus and keep keyboard navigation in the active dialog. */
export default function useModal(open:boolean,close:()=>void){
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement as HTMLElement|null;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const dialogs=document.querySelectorAll<HTMLElement>('.modalBackdrop');
  const dialog=dialogs[dialogs.length-1];
  const focusable=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex="0"]')||[]).filter(el=>el.getClientRects().length>0);
  focusable()[0]?.focus();
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();close();}
   if(event.key==='Tab'){
    const nodes=focusable(),first=nodes[0],last=nodes[nodes.length-1];
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',onKey);
  return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=overflow;previous?.focus()};
 // Closing handlers refer only to React setters; they do not depend on render data.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[open]);
}
