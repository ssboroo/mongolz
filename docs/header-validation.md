# Header and interaction fixes

The header now shares a single search state with the game catalog, provides responsive account controls and an accessible mobile navigation drawer. Featured and original games are included in search. Category and provider filters are controlled consistently.

Dialogs replace one another, trap focus and restore scrolling. Corrupt or blocked browser storage is handled with visible errors. Active blackjack, mines and crash rounds lock their original stake; crash settles once. Stake validation, blackjack natural payouts and baccarat tie refunds were corrected.

Validation: TypeScript check, production build, all 15 existing tests, and a Chromium audit passed. The audit checked widths 320, 360, 390, 760, 768, 850, 1024, 1200 and 1672; shared search, filter reset, modal replacement, registration, long account names, mobile route/hash navigation, locked stakes, maximum stake, language persistence and denied storage. No browser JavaScript errors were observed in these scenarios.

This remains a local demo: no real-money or live-provider play is enabled. These checks cover the exercised scenarios and do not establish that all possible defects are absent.
