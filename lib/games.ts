export type GameId = 'slot'|'roulette'|'blackjack'|'baccarat'|'plinko'|'mines'|'dice'|'crash';
export type GameMeta = { id: GameId; icon: string; category: 'Slots'|'Table'|'Originals'; mn: string; en: string; blurbMn: string; blurbEn: string; tag?: string };
export const games: GameMeta[] = [
  {id:'slot',icon:'🎰',category:'Slots',mn:'Талын Эрдэнэ',en:'Steppe Fortune',blurbMn:'3 мөртэй хурдан demo slot',blurbEn:'Fast 3-reel demo slot',tag:'HOT'},
  {id:'roulette',icon:'🎯',category:'Table',mn:'Алтан Рулет',en:'Golden Roulette',blurbMn:'Улаан / Хар / Тоо сонго',blurbEn:'Red / Black / Number bets',tag:'LIVE STYLE'},
  {id:'blackjack',icon:'🂡',category:'Table',mn:'Хааны 21',en:'Khan 21',blurbMn:'21-д хамгийн ойртоорой',blurbEn:'Classic blackjack demo',tag:'CLASSIC'},
  {id:'baccarat',icon:'🃏',category:'Table',mn:'Талын Баккара',en:'Steppe Baccarat',blurbMn:'Player / Banker / Tie',blurbEn:'Player / Banker / Tie',tag:'TABLE'},
  {id:'plinko',icon:'🔵',category:'Originals',mn:'Тэнгэр Plinko',en:'Sky Plinko',blurbMn:'Бөмбөг унагаж үржүүлэгч ав',blurbEn:'Drop the ball for a multiplier',tag:'ORIGINAL'},
  {id:'mines',icon:'💎',category:'Originals',mn:'Эрдэнийн Уурхай',en:'Gem Mines',blurbMn:'Тэсрэхээс өмнө эрдэнэ ол',blurbEn:'Find gems before a mine',tag:'ORIGINAL'},
  {id:'dice',icon:'🎲',category:'Originals',mn:'Азын Шоо',en:'Lucky Dice',blurbMn:'Over / Under таагаарай',blurbEn:'Roll over or under',tag:'FAST'},
  {id:'crash',icon:'🚀',category:'Originals',mn:'Хөх Тэнгэр Crash',en:'Blue Sky Crash',blurbMn:'Crash-аас өмнө cash out',blurbEn:'Cash out before the crash',tag:'POPULAR'}
];
