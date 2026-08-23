# CapabilityMesh — superseded

This earlier direction placed a technical capability grid below the workspace. The user clarified that this is not the intended composition. See `SurroundGallery.spec.md`: irregular quadrilaterals are now the gallery itself and surround the central creation console.

The remainder of this document is retained only as design-history context.

## Purpose

Replace the generic community gallery with a dense, finite map of Meshy's production capabilities. Every card is a quadrilateral topology node: a visible result on the surface, with understandable and professional explanations underneath.

## Desktop grid

- 12-column CSS grid with 12px gaps.
- Grid maximum width: 1240px.
- Nodes span 3–6 columns and 1–2 row units; minimum row unit 178px.
- 12 representative nodes produce roughly 2–3 viewports including the creation area.
- Each node uses a subtly irregular four-corner polygon; no triangle tiles.

## Node content

- Preview layer: category icon, abstract 3D/wireframe artwork, and short title.
- Hover/focus layer: plain-language outcome, technical tags, and an affordance to inspect the workflow.
- Detail drawer: capability summary, input, process steps, export/output, and next action.

## Capability set

1. Image to 3D
2. Semantic UV
3. Low-poly remesh
4. PBR materials
5. Character rigging
6. Pose and animation
7. Component separation
8. Editable product structure
9. Watertight repair
10. Wall thickness inspection
11. Print-ready part separation
12. Game-engine export

## Visual treatment

- Base palette: graphite, deep teal, black-green, muted cobalt.
- Nodes are connected visually by a faint topology grid beneath them.
- Large nodes receive a brighter art field; small nodes prioritize terminology and relationship cues.
- On hover, the node straightens slightly and its border becomes green/blue, while neighboring topology remains visible.
