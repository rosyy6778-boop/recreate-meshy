# DenseTopologyGallery — hierarchy correction

## Structural principle

Build the topology first. Gallery content occupies selected faces inside it.

The previous version created a set of independent tall image cards and clipped each one into a quadrilateral. That looked like images forced into arbitrary masks rather than a designed mesh. The corrected implementation must use a shared lattice of vertices so adjacent quadrilateral faces share exact edges.

## Mesh density

- Desktop stage: about 1600 × 1850 design units.
- Approximately 12–14 columns and 13–15 rows: at least 150 visible quadrilateral faces.
- X/Y stops are deliberately non-uniform: faces near the creation console and user-asset ring are larger; outer and edge faces are smaller.
- Vertex jitter is restrained so faces remain compact and useful, not long narrow strips.
- Empty faces stay visible through subtle dark fills and green/blue edge lines.
- A few junctions receive low-intensity acid-green glow, making the topology legible without turning it into a neon wallpaper.
- The central operation console covers the mesh but remains visually above it.

## Semantic rings

The topology has three semantic depth levels rather than equal-weight faces.

1. `核心工作区`: command center; stable and brightest.
2. `内层`: returning users see `我的资产`; new users see `你可能感兴趣` based on onboarding intent. Inner filled faces are the largest and use stronger green/teal borders and deeper panels.
3. `外层`: community inspiration. Show `Inspired by your product design workflow` and `Similar assets`; cards are smaller and lines fade toward the viewport edges.

## Returning-user inner assets

- `继续编辑` / `Robot Character` / `2 小时前编辑` / `下一步：Make it animate` / `Auto Rig`.
- `我的资产` / production-ready asset / `Make it production-ready` / `AI Texture + PBR`.
- `我的资产` / modular asset / `Prepare for editing` / `Component Separation`.

## New-user inner suggestions

- Replace the inner assets with onboarding-based starter suggestions.
- Use `你可能感兴趣` and examples for 3D printing, game development, and product design.
- Explain why each item was selected, e.g. `基于你在 onboarding 中选择的产品设计用途`.

## Mentor demo control

- Add a compact, explicitly labelled `演示角色` switch at the upper-right of the stage: `老用户` / `新用户`.
- This control is demo-only and must not look like native Meshy navigation.
- Add a short hint: `内层会随角色变化：老用户是“我的资产”，新用户是“你可能感兴趣”`.
- Switching persona changes inner-ring content only; the community layer remains stable.

## Filled faces

- Only 15–25% of faces contain gallery models.
- Model images use `object-contain`, never `object-cover`.
- Models are proportionally reduced with internal padding so their whole silhouettes remain visible.
- Filled faces use the same shared face geometry as empty faces.
- No independent large cards, masonry columns, or extra clip shapes.
- Inner context cards use the complete face area and include readable metadata plus a next-action cue.
- Outer community cells remain image-led and preserve the model capability hover loops.

## Capability hover loops

Every filled face is assigned one of three short hover demonstrations:

1. `rig`: reveal an animated joint-and-bone overlay over the complete model.
2. `texture`: crossfade between untextured/grayscale and full PBR color, with a moving comparison boundary.
3. `components`: split the image into several layers and move them apart slightly as an exploded-component view.

Hover demonstrations run in the face without cropping the model or opening a drawer. Keyboard focus triggers the same state. Clicking may still open a larger model preview.

## Capability-claim correction

- Community thumbnails never claim `骨骼绑定`, `PBR 贴图`, or `组件拆分`
  merely because a hover animation was assigned to the card.
- Default card badges show the asset category (`角色`, `动物`, `家具`, etc.).
- Hover copy is explicitly labelled as a preview: `骨骼结构示意`,
  `材质对比预览`, or `组件拆分示意`.
- Only owned/project assets with recorded workflow state may state that a
  capability is complete or is the next recommended action.

## Visual system

- Retain Meshy's near-black surface, deep green haze, restrained blue/violet highlights, and acid-green active line.
- Empty topology is darker and quieter than filled model faces.
- The central command center remains the brightest and most stable object.
- Border hierarchy: inner ring roughly 0.30–0.42 alpha; community ring 0.18–0.26; outer edge 0.08–0.15.
- Panel hierarchy follows the same fade so the mesh communicates center, important nodes, and edges before the text is read.

## Third correction — uniform readable gallery

- Restore a mostly uniform shared-vertex quadrilateral lattice: about 10 columns × 13 rows, with restrained shared-vertex jitter.
- Typical face size is approximately 160 × 142 design units so full models remain legible. Do not use tiny 30–80px edge columns.
- The inner persona layer is a ring around the command workspace, not a row beneath it.
- Place a small set of persona examples at the upper-left side, left side, right side, and across the lower edge of the workspace.
- The outer area resumes the normal community Gallery with full-model `object-contain` visuals and the existing capability hover loops.
- Remove the in-flow inner/community layer headings. Ring meaning is communicated by the demo-role helper and the card eyebrow copy.
