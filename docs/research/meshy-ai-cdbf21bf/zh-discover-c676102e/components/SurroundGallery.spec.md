# SurroundGallery — superseded by dense shared topology

The surrounding-gallery relationship remains correct, but the independent large image cells described below produced undesirable narrow crops. `DenseTopologyGallery.spec.md` replaces the implementation details: build a dense shared quadrilateral mesh first, then populate only selected compact faces with proportionally contained models and capability hover animations.

## Intent

The quadrilateral topology is the community gallery itself. It is not a capability-card section below the workspace.

The signed-in creation command center remains the focal object in the middle of the page. Irregular four-sided gallery cells spread around it on all sides: above, left, right, and below. Every cell contains a real 3D model render in the same way the original Meshy gallery contains model previews.

The user's position sketch is only a composition reference. Its gray background is not a color reference.

## Composition

- Desktop only, minimum width 1120px.
- A single relative stage, about 1850px high, provides 2–3 screens of finite content.
- Creation command center sits centrally at the top/middle of the first screen with z-index above the gallery.
- 16–20 irregular quadrilateral cells surround the command center and continue below it.
- Cells may visually pass behind the central panel, but must not obstruct its controls or text.
- Maintain visible breathing room immediately around the command center so it reads as an operating console rather than another gallery tile.

## Gallery cells

- Each tile displays a 3D model render using `object-fit: cover`.
- Shapes use four-corner `clip-path` polygons with varied angles; never use triangular cells.
- Mesh lines are 1px low-contrast green/white borders, with occasional acid-green junction glows.
- Hover raises image brightness/scale and reveals creator, title, likes, and view affordance.
- Clicking opens a large dark preview modal; Escape and backdrop close it.

## Meshy visual language

- Page background: near-black, deep green, and restrained blue/violet haze.
- The reference gray must not appear as the page background.
- Central panel remains almost black with green/blue edge glow.
- Gallery images retain color but receive dark overlays so the central workspace stays dominant.
- Acid green is reserved for mesh edges, active filters, and focus states.

## Content

- Use actual 3D model renders, not line icons or technical capability cards.
- Finite set only; no infinite loader.
- Category chips may filter gallery artwork but stay subordinate to the creation command center.
