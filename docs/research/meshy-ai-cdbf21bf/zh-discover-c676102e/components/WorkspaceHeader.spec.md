# WorkspaceHeader

## Purpose

Preserve the current Meshy desktop navigation architecture so the redesigned
workspace still feels like the same product. The product redesign begins below
the header; navigation is not re-invented.

## Desktop geometry

- Fixed-height top bar: 56px, matching the inspected desktop source.
- Full width with 16px left and 20px right inset.
- Left cluster: Meshy mark, `社区`, `API`, `资源`, `创意工坊`.
- Right cluster: `Agent`, a split `工作区` action, credits, upgrade, gift,
  help, notification, and profile controls.
- Navigation labels use 14px medium-weight text and 34px interaction targets.
- Dark translucent background and 1px low-contrast bottom border.

## Visual treatment

- Background: near-black with subtle blur and a low-contrast bottom border.
- Primary text: warm white; secondary: desaturated gray-green.
- Active/credit accent: acid green; membership accent: muted violet.
- Icons use line SVGs and inherit current color.

## Source extraction

- Source: `https://www.meshy.ai/zh/discover`, signed-in desktop shell.
- Inspected viewport: 1440px.
- Source header height: 56px.
- Source horizontal padding: 16px left / 20px right.
- Source item font size: 14px; active labels use 500–600 weight.
- Source navigation interaction model: click/dropdown, with transparent/dark
  surface depending on page background. This prototype keeps the dark sticky
  surface so the long workspace remains readable while scrolling.
