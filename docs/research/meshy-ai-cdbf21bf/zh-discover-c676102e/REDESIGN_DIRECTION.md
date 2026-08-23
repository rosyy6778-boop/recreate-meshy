# Logged-in Meshy Workspace Redesign Direction

> Correction: the user clarified that the irregular quadrilateral topology is the community gallery itself, distributed around the central operation console. It is not a separate capability-card section below the workspace. The composition sketch provides position only; the finished visual system remains Meshy's dark green/blue/acid-green language. The current implementation direction is specified in `components/SurroundGallery.spec.md`.

## Decision

Do not finish cloning the existing public Discover gallery and modify it afterward. Clone the logged-in workspace shell, then rebuild the gallery layer directly as the proposed quad-topology capability grid.

This is a hybrid strategy:

- **Preserve:** logged-in navigation shell, dark color system, ambient green/blue glow, personalized greeting, mode switcher, central creation panel, generation controls, category/filter language, and page hierarchy.
- **Rebuild:** the heavy infinite community gallery and its content architecture.

## Logged-in workspace findings

Reference: `docs/design-references/meshy-ai-cdbf21bf/zh-discover-c676102e/logged-in-desktop-01.png`

The logged-in experience differs materially from the public page:

1. The public horizontal marketing navigation disappears.
2. The workspace shell uses a sparse utility header:
   - hamburger menu on the left;
   - credits, membership, gift, notification, and avatar utilities on the right.
3. The first visual priority is a personalized greeting and creation question.
4. A compact mode switcher exposes Quick Generate and Agent Mode.
5. The central upload/generation panel is the dominant interaction object.
6. Example images and generation settings stay close to the central panel.
7. Category chips bridge the creation workspace and the community content.
8. The community gallery begins below the fold and can be replaced without destabilizing the primary creation flow.
9. A persistent upgrade strip appears at the bottom of the viewport.

## Recommended page architecture

### 1. WorkspaceShell

Preserve the logged-in application frame rather than the public marketing header.

- left hamburger navigation;
- right utility cluster;
- full-viewport black/charcoal background;
- soft green and blue radial glow concentrated around the creation workspace;
- optional fixed upgrade strip.

### 2. CreationCommandCenter

Keep this visually and behaviorally close to Meshy because it is the product's primary activation mechanism.

- personalized greeting;
- Quick Generate / Agent Mode switch;
- image upload or prompt entry state;
- sample images;
- quality and settings controls;
- clear Generate action.

The redesign should frame this area, not replace it.

### 3. ContextFilterRail

Retain the category-chip pattern as the transition between creation and discovery, but make it a real product control.

Suggested filters:

- For You
- Game Assets
- 3D Printing
- Characters
- Product Design
- Professional Workflows

The selected filter should reorganize capability nodes, not merely change gallery imagery.

### 4. CapabilityMesh

Replace the infinite masonry gallery with a dense quad-based topology grid.

Each quadrilateral cell is a `3D Capability Node` containing:

- a strong asset preview;
- the asset or workflow name;
- capability tags;
- target use case;
- an entry action such as Remix, Try Workflow, or Continue Creating.

Example nodes:

- Backpack Asset: Image-to-3D, Semantic UV, Low-poly Remesh, PBR Materials.
- Character Asset: Rigging, Pose Control, Animation Ready.
- Modular Chair: Component Separation, Editable Parts, Material Control.
- Printable Creature: Watertight Mesh, Thickness Check, Part Separation.

## Progressive disclosure

### Default state

Show the model, category, and one short outcome statement.

### Hover state

Reveal the professional capability and why it matters, using user language before technical vocabulary.

Example:

> Automatically creates an animation-ready skeleton  
> Rigging · Pose Control · Export Ready

### Click state

Open a detail drawer or workspace transition containing the full workflow, parameters, and Remix action.

## Visual integration

The new grid should feel native to the logged-in workspace:

- reuse the charcoal surface and low-contrast borders;
- use the existing lime accent for active states and primary actions;
- use blue/green edge glows sparingly around focused cells;
- keep inactive cells visually quiet;
- let grid lines evoke polygon topology without turning the page into a literal wireframe editor;
- preserve generous negative space around the central creation panel before the denser grid begins.

## Performance approach

The grid should communicate 3D semantics without rendering many live 3D canvases.

- use optimized image or short-video previews by default;
- activate richer motion only on the focused cell;
- render a finite initial set of capability nodes;
- load additional groups on demand or through filters;
- use CSS Grid for the quad structure;
- reserve WebGL for an optional featured node, not every cell;
- avoid reproducing the original infinite feed.

## Product rationale

The existing gallery primarily says, "Meshy can generate attractive objects." The capability mesh should say, "Meshy can move an asset through a professional 3D workflow."

This directly supports:

- **Activation:** examples become actionable starting points.
- **Retention:** returning users see relevant workflows and recent creation context.
- **Conversion:** professional capabilities make the product's production value visible.

## Implementation sequence

1. Reproduce the logged-in workspace shell and creation command center.
2. Create the filter rail and finite capability-node dataset.
3. Build the quad-topology grid directly; do not first clone the existing masonry feed.
4. Add hover disclosure and click-to-workflow behavior.
5. Validate only at the agreed desktop viewport.
