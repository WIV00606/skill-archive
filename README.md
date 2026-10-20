# Celestial Archive

A static character skill showcase for **Scorpio** and **Libra**, built after the layout of
[prydwen.gg](https://www.prydwen.gg/star-rail/characters/aglaea). No build step, no
dependencies — plain HTML, CSS and vanilla JavaScript.

## Run it

The site is fully static and uses relative paths only, so it works both from a web server
and straight off the filesystem.

```bash
# from a local server (recommended)
python3 -m http.server 8765
# then open http://127.0.0.1:8765/
```

Opening `index.html` with `file://` also works.

## Deploy

Upload the whole repository root as-is. There is no build output, no `base` path to
configure and no client-side routing — every page state is driven by the hash-free
JavaScript in `app.js`.

## Files

| File | Role |
|---|---|
| `index.html` | Page skeleton: sidebar, hero, section shells, tab bar |
| `style.css` | All styling, including the 1500 / 1120 / 900 / 700 px breakpoints |
| `data.js` | `CHARACTERS` — every skill text, per character. Also the per-character artwork positioning |
| `app.js` | Rendering, character switching, tab switching, search |
| `assets/scorpio.jpg` | Scorpio artwork |
| `assets/libra.jpg` | Libra artwork |

## Editing content

All skill text lives in `data.js` as a single `CHARACTERS` object:

```
CHARACTERS = {
  scorpio: { title, zodiac, rarities, tagline, tags, art, artZoom, artPos,
             relicName, overview, mechanics, skills: { ur, relic, plus, mr, will } },
  libra:   { ... }
}
```

`mr` and `will` carry the full star-up chain:

```
mr: { name, resource, cost, effect, levels: [{ level, attr, boost }], max: { label, effect, passives } }
```

Add a third character by adding a key to `CHARACTERS` plus a
`<button data-char="...">` in the sidebar and the mobile switcher in `index.html`.

## Search

The top-right search box suggests jump targets as you type and only acts when you
confirm — the page never moves while you are typing.

| Input | Result |
|---|---|
| `Libra UR` | Switch to Libra, open UR Skills |
| `Libra MR+3` | Switch to Libra, open MR Revelation, scroll to and highlight MR+3 |
| `Scorpio IR+5` | Switch to Scorpio, highlight Incarnation Star +5 |
| `Libra Golden Scales` | Switch to Exclusive Relic |
| `venom` | Full-text filter across every skill |
| `libra venom` | Switch to Libra, then filter |

## Artwork framing

The hero is a wide banner, so each character's artwork needs its own crop. Per-character
values live in `data.js`:

- `artZoom` — scale factor (`Scorpio` 1.18 to trim the white margins in the source image, `Libra` 1.25)
- `artPos` — `object-position` for the wide / mid / narrow breakpoints

## Disclaimer

Skill text is reproduced verbatim from the source material; the site is for reference only.
