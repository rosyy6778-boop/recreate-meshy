# CreationCommandCenter — hierarchy correction

## Purpose

Provide the primary signed-in creation workflow and preserve the strongest structural cue from the current Meshy page.

## Desktop geometry

- Maximum content width: 820px; command card width: 780–800px. This restores the smaller visual footprint of the signed-in Meshy reference.
- Greeting centered, 32–36px depending on viewport width.
- Segmented mode switch centered above the card.
- Card minimum height: 270px, 24px radius, internal 16–20px padding.
- Sample strip and settings live inside the lower edge of the card.

## Interaction model

- Click-driven, with two independent hierarchy levels.
- Highest-level switch: `单个资产` / `创建项目`.
- Secondary input rail changes with the highest-level selection:
  - Single asset: `图生 3D` / `Agent 辅助生成`.
  - Project: `从参考图开始` / `让 Agent 帮我规划项目`.
- The secondary rail sits beside the command card and is visually quieter than the highest-level switch.

## Visual treatment

- Near-black card with green glow from upper left and blue glow from lower right.
- Fine grid/noise-like overlays suggest a 3D workspace without overwhelming the upload area.
- Dashed quadrilateral drop zone; bright green primary action.
- Controls share the same dense, dark, professional language as the reference.

## States

- `asset + image`: image-to-3D drop zone and sample images.
- `asset + agent`: task-oriented single-asset prompt.
- `project + reference`: reference-image based project start.
- `project + agent`: project planning prompt covering assets and downstream workflow.
- Exactly two geometry detail modes: `标准模式` and `高细节模式`.

## Detail mode comparison

- Clicking the detail selector opens a 520–560px comparison surface with two side-by-side cards.
- Each card contains a local model image, a subtle animated comparison treatment, suitable audience, expected time, geometry implication, texture implication, and credits indication.
- `标准模式`: balanced speed and detail; about 1–2 minutes; suitable for exploration and iteration.
- `高细节模式`: finer geometry, denser surface detail, PBR-ready output; about 5–8 minutes; suitable for close-ups and production handoff.
- Copy must be understandable without prior 3D knowledge. Avoid unexplained labels.
- Source pattern: Tripo official generation documentation distinguishes Standard as balanced detail/speed and Ultra as maximum/finer geometry detail, with higher cost for detailed geometry. The layout remains original to this Meshy redesign.

## Starting-point cards

- Four cards remain visible in one row on desktop.
- Remove truncation from both title and helper copy.
- Use a fixed icon column and a two-line-capable text column so all Chinese labels render completely.

## Third correction — remove redundant surfaces

- Delete the complete `选择起点` section and all sample-state logic.
- Delete the default local-prototype disclaimer. A generated success status may still appear after the user clicks the action.
- In Agent input states, remove the title and explanatory paragraph above the textarea.
- Move `说出想法，让 Agent 补全制作步骤` into the textarea as the asset-Agent placeholder.
- For project-Agent state, use the parallel placeholder `描述项目目标，让 Agent 帮你规划资产清单和制作步骤`.
- Preserve the top-level task switch, the side input switch, upload/reference state, two detail modes, and generation feedback.
