# SkillArchitecture Specification

## Product rule

A Skill must finish or assess a concrete production task. Basic image-to-3D is
an input mode, not a Skill. Long-running multi-asset work is a project template,
not a single Skill.

## Asset-Agent menu

The `技能` button opens an in-card expandable surface. It never overlays the
detail-level selector or primary action.

### 创意模板

- `Chibi 手办` — 将角色转为头身比例夸张的收藏手办。
- `砖块人物` — 生成积木结构和方块比例角色。
- `冰箱磁贴` — 把主体做成适合平面展示的浮雕磁贴。
- `扭蛋玩具` — 生成适合小型收藏玩具的圆润造型。
- `Low Poly` — 用较少面数保留清晰轮廓。
- `写实模型` — 强化真实比例、材质与表面细节。
- `动漫角色` — 使用动漫比例和风格化面部特征。
- `玩具风格` — 生成圆润、简化且适合展示的玩具造型。

### 生产工具

- `游戏资产基础检查` — 检查面数、UV、材质、法线和骨骼，给出优先修复建议。
- `3D 打印基础检查` — 检查封闭性、非流形、薄壁和悬空风险。
- `PBR 材质补全` — 检查并补齐基础色、粗糙度、金属度和法线贴图。
- `骨骼绑定` — 为角色建立骨架，准备姿势和动作测试。
- `组件拆分` — 将整体模型拆成可独立编辑的部件。

Every item uses one inline text row. The name and explanation have the same
font size; the explanation uses a lighter color rather than smaller type.

## Project-Agent menu

The same control is labelled `项目模板` in project mode. It exposes:

- `制作可动画角色` — 从造型和贴图推进到骨骼绑定与动作测试。
- `验证产品外观方案` — 整理外观方案、组件关系与对比视图。
- `制作一套游戏道具` — 保持风格比例一致并追踪每件道具进度。
- `拆解场景并制作资产` — 识别场景主要物件，确认清单后安排建模。

Selecting a template may seed the planning prompt, but does not generate or
consume credits. The user confirms the generated plan before any asset task.

## Lightweight production checks

The first prototype presents analysis only. It does not promise automatic LOD,
Unity/Unreal compatibility, material-weight estimates, or manufacturing/CAD
validation.

- Game check result: polygon risk, UV presence, material/texture presence,
  normals, skeleton presence, and one priority next step.
- Print check result: watertightness, non-manifold risk, obvious thin walls,
  unsupported/fragment risk, and whether scale information is available.

## Compact command row

- `添加图片`, `技能`/`项目模板`, and two context suggestions share one row.
- The unverified `最多 4 张` copy is removed with no replacement limit.
- The upload control remains a prototype input and does not claim a source
  product limit.
