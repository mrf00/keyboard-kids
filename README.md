# Keyboard kids

This is a simple app I created so my kids could practise typing during COVID lockdown.

Written in Svelte, with Tailwind CSS and Font Awesome icons. Everything runs client side - settings are stored in localStorage.

Try it live: https://keyboard-kids.netlify.app

Dev server: `npm run dev`

Word list can be modified at `_availablewords.json`. By default, it just includes the ones I thought my kids would like.

To remap a word <-> icon pair, modify `_wordoverrides.json`.

Possible TODOs:

* [ ] Better progress display
* [ ] Use browser fullscreen APIs
* [ ] Store progress/state in localStorage too
* [ ] More graphical tweaks
* [ ] Make the settings harder to get into so the kids don't keep resetting things