# Malbolge Adder

A GitHub Pages front end for a real Malbolge addition program.

## Files

- `index.html` — UI. Fetches `adder.mal` and sends the two inputs to the VM.
- `malbolge.js` — browser implementation of the original Malbolge virtual machine.
- `adder.mal` — the real Malbolge adder source supplied for this project.

## Input

Enter two integers from **0 to 999** and press **RUN MALBOLGE**.

The HTML/JavaScript does **not** calculate `A + B`. JavaScript only implements the
Malbolge interpreter. The arithmetic algorithm lives in `adder.mal`.

## Dependency test

Rename or delete `adder.mal` and reload the page. The RUN button remains disabled,
proving the page depends on the Malbolge source.

## GitHub Pages

Put all three files at the repository root, enable GitHub Pages for the main branch,
and open the Pages URL. Opening `index.html` directly with `file://` may block `fetch`,
so serve it over HTTP/GitHub Pages.


## Verified examples

- `1 + 2` -> `3`
- `123 + 456` -> `579`
- `999 + 999` -> `1998`
- `0 + 0` -> `0`

The VM was corrected to post-cipher `mem[c]` after instruction execution, matching
the original Malbolge interpreter. This matters for the `i` instruction because it
can change `c` before the self-modification step.
