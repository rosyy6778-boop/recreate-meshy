"use client";

import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Filter,
  FolderKanban,
  Heart,
  History,
  PackageCheck,
  Search,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ModelCapabilityVisual,
  type CapabilityMode,
} from "@/components/meshy/model-capability-visual";
import type { ManagedProject } from "@/components/meshy/project-demo-types";

type Persona = "returning" | "new";
type WorkflowGroup = "attention" | "continue" | "optimize";
type ContentChannel = "all" | "printing";
type AssetCategory =
  | "character"
  | "vehicle"
  | "animal"
  | "architecture"
  | "furniture"
  | "prop"
  | "weapon"
  | "clothing"
  | "classic"
  | "food";
type BrowseCategory = "featured" | AssetCategory;
type SortMode = "recommended" | "popular" | "new";

type WorkflowItem = {
  id: string;
  title: string;
  meta: string;
  currentState: string;
  nextStep: string;
  action: string;
  image: string;
  group: WorkflowGroup;
};

type GalleryAsset = {
  id: string;
  title: string;
  creator: string;
  image: string;
  mode: CapabilityMode;
  likes: number;
  category: AssetCategory;
  channels: Array<"featured" | "printing">;
  tags: string[];
  freshness: number;
};

const returningItems: WorkflowItem[] = [
  {
    id: "modular-chair",
    title: "模块化座椅",
    meta: "3 天前编辑",
    currentState: "整体形体已生成，尚未拆件",
    nextStep: "拆成可编辑组件",
    action: "组件拆分",
    image: "/images/meshy-gallery/orange-chair.jpg",
    group: "attention",
  },
  {
    id: "robot-character",
    title: "机器人角色",
    meta: "2 小时前编辑",
    currentState: "模型与贴图已完成",
    nextStep: "让角色动起来",
    action: "骨骼绑定",
    image: "/images/meshy-gallery/stylized-character.jpg",
    group: "continue",
  },
  {
    id: "product-robot",
    title: "产品机器人",
    meta: "昨天更新",
    currentState: "基础几何已确认",
    nextStep: "补齐生产级材质",
    action: "AI 贴图 + PBR",
    image: "/images/meshy-gallery/robot-danigmos.jpg",
    group: "optimize",
  },
  {
    id: "fantasy-creature",
    title: "奇幻生物",
    meta: "5 天前编辑",
    currentState: "角色结构已检查",
    nextStep: "绑定并测试动作",
    action: "骨骼绑定与动画",
    image: "/images/meshy-gallery/chupacabra.jpg",
    group: "optimize",
  },
];

const activeProjects: ManagedProject[] = [
  {
    id: "game-prop-set",
    title: "游戏道具套装",
    meta: "昨天更新",
    completed: 4,
    total: 7,
    nextStep: "继续生成缺失道具",
    assets: [
      { id: "hero", title: "主角装备", status: "completed", image: "/images/meshy-gallery/stylized-character.jpg", note: "模型与贴图已完成" },
      { id: "mech", title: "侦察机器人", status: "completed", image: "/images/meshy-gallery/robot-danigmos.jpg", note: "骨骼绑定已完成" },
      { id: "weapon", title: "能量武器", status: "next", image: "/images/meshy-gallery/community/verdant-amethyst-axe.webp", note: "下一步：补充 PBR 贴图" },
      { id: "supply", title: "补给箱", status: "waiting", image: "/images/meshy-gallery/x02-robot.jpg", note: "等待确认造型方向" },
    ],
  },
  {
    id: "furniture-series",
    title: "家具产品系列",
    meta: "3 天前更新",
    completed: 3,
    total: 4,
    nextStep: "统一系列材质与尺寸",
    assets: [
      { id: "lounge", title: "休闲座椅", status: "completed", image: "/images/meshy-gallery/orange-chair.jpg", note: "造型方案已锁定" },
      { id: "wood", title: "木制餐椅", status: "completed", image: "/images/meshy-gallery/wood-chair.jpg", note: "组件拆分已完成" },
      { id: "soft", title: "软包座椅", status: "next", image: "/images/meshy-gallery/chair-sharetextures.jpg", note: "下一步：统一 PBR 材质" },
    ],
  },
];

const completedProjects = [
  { id: "creature-pack", title: "生物概念套装", count: "5 个模型", meta: "上周完成", image: "/images/meshy-gallery/monster.jpg" },
  { id: "hero-series", title: "英雄角色系列", count: "2 个模型", meta: "3 天前完成", image: "/images/meshy-gallery/stylized-character.jpg" },
  { id: "chair-variations", title: "座椅方案集", count: "3 个模型", meta: "本月完成", image: "/images/meshy-gallery/chair-sharetextures.jpg" },
];

const newUserItems: WorkflowItem[] = [
  {
    id: "starter-first-model",
    title: "创建第一个模型",
    meta: "快速入门",
    currentState: "准备一张主体清晰的图片",
    nextStep: "生成并查看完整形体",
    action: "开始图生 3D",
    image: "/images/meshy-gallery/low-poly-robot.jpg",
    group: "attention",
  },
  {
    id: "starter-game-character",
    title: "可动画游戏角色",
    meta: "基于游戏开发偏好",
    currentState: "从完整人形角色开始",
    nextStep: "自动绑定并测试动作",
    action: "使用角色模板",
    image: "/images/meshy-gallery/stylized-character.jpg",
    group: "continue",
  },
  {
    id: "starter-product",
    title: "产品概念验证",
    meta: "基于产品设计偏好",
    currentState: "从产品参考图开始",
    nextStep: "比较造型和 PBR 材质",
    action: "使用产品模板",
    image: "/images/meshy-gallery/chair-sharetextures.jpg",
    group: "continue",
  },
  {
    id: "starter-print",
    title: "制作可打印模型",
    meta: "3D 打印",
    currentState: "选择轮廓明确的主体",
    nextStep: "检查厚度与封闭结构",
    action: "开始打印流程",
    image: "/images/meshy-gallery/robot-danigmos.jpg",
    group: "attention",
  },
  {
    id: "starter-scene",
    title: "规划一组场景资产",
    meta: "智能助理项目",
    currentState: "描述场景、风格和交付目标",
    nextStep: "生成资产清单和顺序",
    action: "规划项目",
    image: "/images/meshy-gallery/x02-robot.jpg",
    group: "optimize",
  },
  {
    id: "starter-texture",
    title: "理解 PBR 材质",
    meta: "产品可视化",
    currentState: "观察灰模与成品的差异",
    nextStep: "比较材质通道",
    action: "查看示例",
    image: "/images/meshy-gallery/wood-chair.jpg",
    group: "optimize",
  },
];

const galleryAssets: GalleryAsset[] = [
  { id: "desert-rider", title: "荒漠骑手", creator: "redmanops", image: "/images/meshy-gallery/community/desert-rider.webp", mode: "rig", likes: 14, category: "clothing", channels: ["featured"], tags: ["Desert Rider", "角色", "服装"], freshness: 31 },
  { id: "emberblade", title: "烬刃亡魂", creator: "Virus", image: "/images/meshy-gallery/community/emberblade-revenant.webp", mode: "rig", likes: 6, category: "character", channels: ["featured"], tags: ["Emberblade", "奇幻", "角色"], freshness: 30 },
  { id: "runebound", title: "符文守卫", creator: "Virus", image: "/images/meshy-gallery/community/runebound-warden.webp", mode: "components", likes: 6, category: "character", channels: ["featured", "printing"], tags: ["Runebound", "守卫", "拆分"], freshness: 29 },
  { id: "stone-fortress", title: "石砌堡垒", creator: "bradjune1980", image: "/images/meshy-gallery/community/stone-fortress.webp", mode: "components", likes: 4, category: "architecture", channels: ["featured", "printing"], tags: ["Fortress", "建筑", "场景"], freshness: 28 },
  { id: "vintage-bike", title: "复古训练单车", creator: "theanh75", image: "/images/meshy-gallery/community/vintage-training-bike.webp", mode: "components", likes: 122, category: "vehicle", channels: ["featured"], tags: ["Bike", "载具", "机械"], freshness: 27 },
  { id: "moonlit-doll", title: "月光人偶", creator: "Meshy Events", image: "/images/meshy-gallery/community/moonlit-doll.webp", mode: "rig", likes: 45, category: "character", channels: ["featured", "printing"], tags: ["Doll", "手办", "角色"], freshness: 26 },
  { id: "mechanical-gate", title: "机械嘉年华大门", creator: "SF-DesignWorks", image: "/images/meshy-gallery/community/mechanical-carnival-gate.webp", mode: "components", likes: 37, category: "architecture", channels: ["featured"], tags: ["Gate", "建筑", "机械"], freshness: 25 },
  { id: "marmotte-ball", title: "旱獭球", creator: "Flotte", image: "/images/meshy-gallery/community/marmotte-ball.webp", mode: "components", likes: 20, category: "animal", channels: ["featured", "printing"], tags: ["Marmotte", "动物", "玩具"], freshness: 24 },
  { id: "ronin-mech", title: "浪人机甲鬼面", creator: "flores.2010.06", image: "/images/meshy-gallery/community/ronin-mech-oni.webp", mode: "texture", likes: 69, category: "prop", channels: ["featured"], tags: ["Oni", "面具", "PBR"], freshness: 23 },
  { id: "toybox-astrobot", title: "玩具箱星际机器人", creator: "Hirani", image: "/images/meshy-gallery/community/toybox-astrobot.webp", mode: "rig", likes: 47, category: "character", channels: ["featured", "printing"], tags: ["Robot", "机器人", "动画"], freshness: 22 },
  { id: "goblin-alchemist", title: "哥布林炼金师", creator: "Virus", image: "/images/meshy-gallery/community/goblin-alchemist.webp", mode: "rig", likes: 45, category: "character", channels: ["featured"], tags: ["Goblin", "角色", "奇幻"], freshness: 21 },
  { id: "urban-graffiti", title: "都市涂鸦肖像", creator: "athalwolf7", image: "/images/meshy-gallery/community/urban-graffiti-portrait.webp", mode: "texture", likes: 9, category: "classic", channels: ["featured"], tags: ["Portrait", "涂鸦", "材质"], freshness: 20 },
  { id: "winking-seal", title: "冰上眨眼海豹", creator: "Grace", image: "/images/meshy-gallery/community/winking-seal.webp", mode: "rig", likes: 38, category: "animal", channels: ["featured", "printing"], tags: ["Seal", "动物", "可爱"], freshness: 19 },
  { id: "nut-shopkeeper", title: "松果小店长", creator: "theanh75", image: "/images/meshy-gallery/community/nut-shopkeeper.webp", mode: "rig", likes: 73, category: "animal", channels: ["featured"], tags: ["Squirrel", "动物", "角色"], freshness: 18 },
  { id: "crescent-cake", title: "蓝色弯月蛋糕", creator: "xXSmokeXx", image: "/images/meshy-gallery/community/blue-crescent-cake.webp", mode: "texture", likes: 8, category: "food", channels: ["featured", "printing"], tags: ["Cake", "食物", "PBR"], freshness: 17 },
  { id: "toy-train", title: "玩具火车环线", creator: "Talli", image: "/images/meshy-gallery/community/toy-train-loop.webp", mode: "components", likes: 12, category: "classic", channels: ["featured", "printing"], tags: ["Train", "玩具", "拆分"], freshness: 16 },
  { id: "amethyst-hatchling", title: "紫晶幼龙", creator: "jurafjvs", image: "/images/meshy-gallery/community/amethyst-hatchling.webp", mode: "rig", likes: 73, category: "animal", channels: ["featured"], tags: ["Dragon", "幼龙", "动画"], freshness: 15 },
  { id: "sunlit-owlet", title: "日光小鸮", creator: "ysproottell", image: "/images/meshy-gallery/community/sunlit-owlet.webp", mode: "rig", likes: 17, category: "animal", channels: ["featured", "printing"], tags: ["Owl", "猫头鹰", "动物"], freshness: 14 },
  { id: "stardust-foxling", title: "星尘小狐", creator: "kaesar3d", image: "/images/meshy-gallery/community/stardust-foxling.webp", mode: "texture", likes: 15, category: "animal", channels: ["featured"], tags: ["Fox", "小狐", "PBR"], freshness: 13 },
  { id: "whiskerlock", title: "胡须侦探", creator: "AH3GA0", image: "/images/meshy-gallery/community/whiskerlock-holmes.webp", mode: "rig", likes: 32, category: "character", channels: ["featured"], tags: ["Cat", "侦探", "角色"], freshness: 12 },
  { id: "bucket-dragon", title: "星光桶龙", creator: "Virus", image: "/images/meshy-gallery/community/starlight-bucket-dragon.webp", mode: "components", likes: 26, category: "animal", channels: ["featured", "printing"], tags: ["Dragon", "生物", "拆分"], freshness: 11 },
  { id: "amethyst-axe", title: "翠绿紫晶战斧", creator: "cyber_fox", image: "/images/meshy-gallery/community/verdant-amethyst-axe.webp", mode: "texture", likes: 110, category: "weapon", channels: ["featured"], tags: ["Axe", "武器", "PBR"], freshness: 10 },
  { id: "bengal-tiger", title: "孟加拉虎", creator: "jeremifolta99", image: "/images/meshy-gallery/community/regal-bengal-tiger.webp", mode: "rig", likes: 9, category: "animal", channels: ["featured"], tags: ["Tiger", "动物", "骨骼绑定"], freshness: 9 },
  { id: "froggy-delivery", title: "青蛙特快专递", creator: "theanh75", image: "/images/meshy-gallery/community/froggy-special-delivery.webp", mode: "rig", likes: 18, category: "character", channels: ["featured"], tags: ["Frog", "角色", "动画"], freshness: 8 },
  { id: "cloud-sheep", title: "云朵小羊", creator: "jiezhao", image: "/images/meshy-gallery/community/cloud-sheep.webp", mode: "texture", likes: 53, category: "animal", channels: ["featured", "printing"], tags: ["Sheep", "动物", "材质"], freshness: 7 },
  { id: "mushroom-keeper", title: "蘑菇守护者", creator: "stockaccshutter", image: "/images/meshy-gallery/community/mushroom-keeper.webp", mode: "rig", likes: 33, category: "character", channels: ["featured"], tags: ["Mushroom", "角色", "动画"], freshness: 6 },
  { id: "burger-burrow", title: "汉堡小屋", creator: "xXSmokeXx", image: "/images/meshy-gallery/community/burger-burrow.webp", mode: "components", likes: 10, category: "food", channels: ["featured", "printing"], tags: ["Burger", "食物", "场景"], freshness: 5 },
  { id: "tiger-cub", title: "幼虎伙伴", creator: "kaesar3d", image: "/images/meshy-gallery/community/tiger-cub-companion.webp", mode: "texture", likes: 9, category: "animal", channels: ["featured"], tags: ["Tiger", "幼虎", "材质"], freshness: 4 },
  { id: "soft-chair", title: "柔软曲面座椅", creator: "DarvinAbraham", image: "/images/meshy-gallery/orange-chair.jpg", mode: "texture", likes: 481, category: "furniture", channels: ["featured", "printing"], tags: ["Chair", "家具", "PBR"], freshness: 3 },
  { id: "bentwood-chair", title: "弯木餐椅", creator: "Sketchfab Community", image: "/images/meshy-gallery/wood-chair.jpg", mode: "components", likes: 374, category: "furniture", channels: ["featured", "printing"], tags: ["Chair", "家具", "拆分"], freshness: 2 },
  { id: "lounge-chair", title: "PBR 休闲椅", creator: "ShareTextures", image: "/images/meshy-gallery/chair-sharetextures.jpg", mode: "texture", likes: 437, category: "furniture", channels: ["featured", "printing"], tags: ["Chair", "家具", "PBR"], freshness: 1 },
];

const categoryOptions: Array<{ id: BrowseCategory; label: string }> = [
  { id: "featured", label: "精选" },
  { id: "character", label: "角色" },
  { id: "vehicle", label: "载具" },
  { id: "animal", label: "动物" },
  { id: "architecture", label: "建筑" },
  { id: "furniture", label: "家具" },
  { id: "prop", label: "道具" },
  { id: "weapon", label: "武器" },
  { id: "clothing", label: "服装" },
  { id: "classic", label: "经典" },
  { id: "food", label: "食物" },
];

const categoryLabels = Object.fromEntries(
  categoryOptions
    .filter((option) => option.id !== "featured")
    .map((option) => [option.id, option.label]),
) as Record<AssetCategory, string>;

const workflowColumns: Array<{
  id: WorkflowGroup;
  title: string;
  description: string;
}> = [
  { id: "attention", title: "待处理", description: "需要你先做决定" },
  { id: "continue", title: "继续工作", description: "从上次进度接着做" },
  { id: "optimize", title: "建议优化", description: "让资产更接近交付" },
];

function capabilityLabel(mode: CapabilityMode) {
  if (mode === "rig") return "骨骼结构示意";
  if (mode === "texture") return "材质对比预览";
  return "组件拆分示意";
}

function WorkflowCard({ item, active, onSelect }: { item: WorkflowItem; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`group mesh-focus-ring flex min-h-[118px] w-full items-stretch gap-3 rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${active ? "border-[#a9ff55]/38 bg-[#a9ff55]/[0.065]" : "border-white/[0.07] bg-[#0b0f0c]/82 hover:border-[#a9ff55]/22"}`}
      onClick={onSelect}
    >
      <span className="relative w-[84px] shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-black/28">
        <Image fill src={item.image} alt="" sizes="84px" className="object-contain p-1.5 opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col py-0.5">
        <span className="flex items-start justify-between gap-2">
          <strong className="truncate text-sm font-medium text-white/88">{item.title}</strong>
          <span className="shrink-0 text-[11px] text-white/32">{item.meta}</span>
        </span>
        <span className="mt-2 truncate text-xs text-white/42">{item.currentState}</span>
        <span className="mt-auto flex items-center gap-1 truncate text-xs font-semibold text-[#c5ff91]/72">
          {item.nextStep} · {item.action}<ArrowRight className="size-3 shrink-0" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

function ProjectCard({ project, open, onToggle }: { project: ManagedProject; open: boolean; onToggle: () => void }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0e0b]/88">
      <button type="button" aria-expanded={open} className="mesh-focus-ring flex w-full items-center gap-4 px-4 py-3.5 text-left transition hover:bg-white/[0.025]" onClick={onToggle}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#a9ff55]/18 bg-[#a9ff55]/8 text-[#c9ff97]"><FolderKanban className="size-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-3"><strong className="truncate text-sm font-semibold text-white/88">{project.title}</strong><span className="text-[11px] text-white/32">{project.meta}</span>{project.statusText ? <span className="text-[11px] text-[#c8ff96]/58">{project.statusText}</span> : null}</span>
          <span className="mt-2 flex items-center gap-3"><progress className="h-1.5 w-40 accent-[#a9ff55]" value={project.completed} max={project.total} aria-label={`${project.title}完成进度`} /><span className="text-[11px] tabular-nums text-white/42">{project.completed} / {project.total} 个模型</span><span className="text-xs font-medium text-[#c8ff96]/70">{project.nextStep}</span></span>
          {project.contextTags ? <span className="mt-2 flex flex-wrap gap-1.5">{project.contextTags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-0.5 text-[10px] text-white/42">{tag}</span>)}</span> : null}
        </span>
        <span className="flex -space-x-2">{project.assets.slice(0, 3).map((asset) => <span key={asset.id} className="relative size-9 overflow-hidden rounded-lg border-2 border-[#0a0e0b] bg-black/35"><Image fill src={asset.image} alt="" sizes="36px" className="object-contain p-1" /></span>)}</span>
        <ChevronDown className={`size-4 text-white/35 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="border-t border-white/[0.06] p-3">{project.contextNote ? <p className="mb-3 flex items-center gap-2 rounded-lg border border-[#a9ff55]/12 bg-[#a9ff55]/[0.035] px-3 py-2 text-[11px] text-[#d1ffa9]/58"><FolderKanban className="size-3.5" />{project.contextNote}</p> : null}<div className="grid grid-cols-4 gap-2">{project.assets.map((asset) => <button key={asset.id} type="button" className="mesh-focus-ring flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.018] p-2.5 text-left hover:border-[#a9ff55]/20"><span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-black/28"><Image fill src={asset.image} alt="" sizes="48px" className="object-contain p-1" /></span><span className="min-w-0"><strong className="block truncate text-xs font-medium text-white/78">{asset.title}</strong><span className="mt-1 block truncate text-[11px] text-white/38">{asset.note}</span><span className={`mt-1.5 block text-[10px] ${asset.status === "completed" ? "text-[#a9ff55]/62" : asset.status === "next" ? "text-[#ffc77b]/68" : "text-white/32"}`}>{asset.status === "completed" ? "已完成" : asset.status === "next" ? "下一步" : "等待中"}</span></span></button>)}</div></div> : null}
    </article>
  );
}

export function ContinueWorkBoard({ createdProject }: { createdProject?: ManagedProject | null }) {
  const [persona, setPersona] = useState<Persona>("returning");
  const [selectedId, setSelectedId] = useState(returningItems[0].id);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<string | null>(createdProject?.id ?? activeProjects[0].id);
  const items = persona === "returning" ? returningItems : newUserItems;
  const visibleProjects = createdProject ? [createdProject, ...activeProjects] : activeProjects;

  function changePersona(nextPersona: Persona) {
    setPersona(nextPersona);
    const nextItems = nextPersona === "returning" ? returningItems : newUserItems;
    setSelectedId(nextItems[0].id);
    setCompletedOpen(false);
    setOpenProjectId(nextPersona === "returning" ? activeProjects[0].id : null);
  }

  return (
    <section id="continue-work" className="scroll-mt-20 mx-auto mt-10 w-full max-w-[1180px] text-white" aria-labelledby="continue-work-title">
      <div className="flex items-end justify-between gap-8 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#a9ff55]/62">
            <History className="size-3.5" aria-hidden="true" />
            {persona === "returning" ? "我的工作" : "入门流程"}
          </div>
          <h2 id="continue-work-title" className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">
            {persona === "returning" ? "继续工作" : "推荐起点"}
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-white/38">
            {persona === "returning" ? "优先展示需要处理的项目，再给出可执行的下一步。" : "没有历史项目时，根据使用偏好提供可直接开始的路径。"}
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-[#a9ff55]/20 bg-[#090e0b]/78 p-1.5 backdrop-blur-xl">
          <div className="flex items-center gap-1" role="tablist" aria-label="演示用户角色">
            <span className="px-2 text-[10px] tracking-[0.1em] text-white/28">演示视图</span>
            <button type="button" role="tab" aria-selected={persona === "returning"} className={`mesh-focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition ${persona === "returning" ? "bg-[#a9ff55] font-semibold text-[#10180b]" : "text-white/42 hover:text-white/76"}`} onClick={() => changePersona("returning")}>
              <UserRound className="size-3" aria-hidden="true" />老用户
            </button>
            <button type="button" role="tab" aria-selected={persona === "new"} className={`mesh-focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition ${persona === "new" ? "bg-[#a9ff55] font-semibold text-[#10180b]" : "text-white/42 hover:text-white/76"}`} onClick={() => changePersona("new")}>
              <UsersRound className="size-3" aria-hidden="true" />新用户
            </button>
          </div>
        </div>
      </div>

      {persona === "returning" ? (
        <section className="mt-5" aria-labelledby="active-projects-title">
          <div className="mb-2.5 flex items-center gap-2 px-1">
            <FolderKanban className="size-4 text-[#a9ff55]/65" aria-hidden="true" />
            <h3 id="active-projects-title" className="text-sm font-semibold text-white/76">进行中的项目</h3>
            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-white/42">{visibleProjects.length}</span>
            <p className="ml-2 text-xs text-white/32">一个项目集中管理关联模型、进度与下一步。</p>
          </div>
          <div className="space-y-2">
            {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} open={openProjectId === project.id} onToggle={() => setOpenProjectId((current) => current === project.id ? null : project.id)} />)}
          </div>
        </section>
      ) : null}

      <div className="mt-4 grid grid-cols-3 items-start gap-3">
        {workflowColumns.map((column) => {
          const columnItems = items.filter((item) => item.group === column.id);
          return (
            <section key={column.id} className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-2.5" aria-labelledby={`workflow-${column.id}`}>
              <div className="flex items-center justify-between px-1 pb-2.5">
                <div>
                  <h3 id={`workflow-${column.id}`} className="text-sm font-semibold text-white/76">{persona === "new" && column.id === "attention" ? "快速开始" : column.title}</h3>
                  <p className="mt-0.5 text-[11px] text-white/30">{column.description}</p>
                </div>
                <span className="grid size-6 place-items-center rounded-full bg-white/[0.04] text-[11px] text-white/40">{columnItems.length}</span>
              </div>
              <div className="space-y-2">
                {columnItems.map((item) => (
                  <WorkflowCard key={item.id} item={item} active={selectedId === item.id} onSelect={() => setSelectedId(item.id)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {persona === "returning" ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06] bg-black/18">
          <button type="button" className="mesh-focus-ring flex w-full items-center gap-2 px-4 py-3 text-left text-xs text-white/48 transition hover:bg-white/[0.025] hover:text-white/68" aria-expanded={completedOpen} onClick={() => setCompletedOpen((current) => !current)}>
            <PackageCheck className="size-4 text-[#a9ff55]/58" aria-hidden="true" />已完成的项目
            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px]">{completedProjects.length}</span>
            <span className="text-[11px] text-white/28">默认收起，避免挤占首页空间</span>
            <ChevronDown className={`ml-auto size-3 transition ${completedOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          {completedOpen ? (
            <div className="grid grid-cols-3 gap-2.5 border-t border-white/[0.06] p-3">
              {completedProjects.map((project) => (
                <button key={project.id} type="button" className="mesh-focus-ring flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-3 text-left hover:border-[#a9ff55]/18">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-black/30"><Image fill src={project.image} alt="" sizes="56px" className="object-contain p-1" /></span>
                  <span className="min-w-0"><strong className="block truncate text-sm font-medium text-white/78">{project.title}</strong><span className="mt-1 block text-[11px] text-white/38">{project.count} · {project.meta}</span><span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#c5ff91]/65">查看交付记录<ArrowRight className="size-3" /></span></span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function CommunityGallery() {
  const [selectedAsset, setSelectedAsset] = useState<GalleryAsset | null>(null);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<ContentChannel>("all");
  const [category, setCategory] = useState<BrowseCategory>("featured");
  const [capability, setCapability] = useState<CapabilityMode | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const closePreview = useCallback(() => {
    setSelectedAsset(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (selectedAsset) closePreview();
      setFiltersOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    if (selectedAsset) closeButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePreview, selectedAsset]);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return galleryAssets
      .filter((asset) => channel === "all" || asset.channels.includes(channel))
      .filter((asset) => category === "featured" ? asset.channels.includes("featured") : asset.category === category)
      .filter((asset) => capability === "all" || asset.mode === capability)
      .filter((asset) => {
        if (!normalizedQuery) return true;
        return [asset.title, asset.creator, ...asset.tags].join(" ").toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortMode === "popular") return b.likes - a.likes;
        if (sortMode === "new") return b.freshness - a.freshness;
        return Number(b.channels.includes("featured")) - Number(a.channels.includes("featured")) || b.likes - a.likes;
      });
  }, [capability, category, channel, query, sortMode]);

  function resetDiscovery() {
    setQuery("");
    setChannel("all");
    setCategory("featured");
    setCapability("all");
  }

  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-8 pb-32 pt-14 text-white" aria-labelledby="community-gallery-title">
      <div className="border-b border-white/[0.07] pb-4">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#a9ff55]/62">社区发现</p>
            <h2 id="community-gallery-title" className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">社区灵感</h2>
            <p className="mt-1 text-[13px] leading-5 text-white/38">按用途和模型类型找到可复用的创作参考。</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative block w-[300px]">
              <span className="sr-only">搜索模型、作者或标签</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-white/28" aria-hidden="true" />
              <input type="search" value={query} placeholder="搜索模型、作者或标签" className="mesh-focus-ring h-10 w-full rounded-xl border border-white/[0.08] bg-[#0c100e]/86 pl-9 pr-9 text-xs text-white/78 placeholder:text-white/28" onChange={(event) => setQuery(event.target.value)} />
              {query ? (
                <button type="button" aria-label="清除搜索" className="mesh-focus-ring absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-white/30 hover:text-white" onClick={() => setQuery("")}><X className="size-3" aria-hidden="true" /></button>
              ) : null}
            </label>
            <div className="relative">
              <button type="button" aria-expanded={filtersOpen} className={`mesh-focus-ring flex h-10 items-center gap-2 rounded-xl border px-3.5 text-xs transition ${filtersOpen || capability !== "all" ? "border-[#a9ff55]/32 bg-[#a9ff55]/10 text-[#d2ffa9]" : "border-white/[0.08] bg-[#0c100e]/86 text-white/48 hover:text-white/76"}`} onClick={() => setFiltersOpen((current) => !current)}>
                <Filter className="size-3.5" aria-hidden="true" />筛选
                {capability !== "all" ? <span className="grid size-4 place-items-center rounded-full bg-[#a9ff55] text-[7px] text-black">1</span> : null}
              </button>
              {filtersOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[300px] rounded-2xl border border-white/10 bg-[#0b0e0c]/98 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.72)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/76"><SlidersHorizontal className="size-4" />高级筛选</div>
                  <p className="mt-4 text-[11px] tracking-[0.12em] text-white/32">演示预览</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {(["all", "rig", "texture", "components"] as const).map((mode) => (
                      <button key={mode} type="button" className={`mesh-focus-ring rounded-lg px-2.5 py-2 text-xs transition ${capability === mode ? "bg-[#a9ff55] font-semibold text-black" : "bg-white/[0.04] text-white/42 hover:text-white/72"}`} onClick={() => setCapability(mode)}>{mode === "all" ? "全部演示" : capabilityLabel(mode)}</button>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] tracking-[0.12em] text-white/32">排序</p>
                  <div className="mt-2 flex gap-1.5">
                    {(["recommended", "popular", "new"] as const).map((mode) => (
                      <button key={mode} type="button" className={`mesh-focus-ring flex-1 rounded-lg px-2 py-2 text-[11px] transition ${sortMode === mode ? "bg-white text-black" : "bg-white/[0.04] text-white/42 hover:text-white/72"}`} onClick={() => setSortMode(mode)}>{mode === "recommended" ? "推荐" : mode === "popular" ? "最受欢迎" : "最新"}</button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-1 rounded-xl bg-white/[0.025] p-1" role="tablist" aria-label="内容入口">
            {([["all", "全部"], ["printing", "3D 打印"]] as const).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={channel === id} className={`mesh-focus-ring rounded-lg px-3 py-2 text-xs transition ${channel === id ? "bg-white font-semibold text-black" : "text-white/36 hover:text-white/70"}`} onClick={() => setChannel(id)}>{label}</button>
            ))}
          </div>
          <span className="mx-1 h-5 w-px bg-white/[0.07]" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden" aria-label="模型类别">
            {categoryOptions.map((option) => (
              <button key={option.id} type="button" aria-pressed={category === option.id} className={`mesh-focus-ring shrink-0 rounded-lg px-2.5 py-2 text-xs transition ${category === option.id ? "bg-[#a9ff55]/14 text-[#d0ffa5]" : "text-white/38 hover:bg-white/[0.035] hover:text-white/68"}`} onClick={() => setCategory(option.id)}>{option.label}</button>
            ))}
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-white/30">{filteredAssets.length} 个结果</span>
        </div>
      </div>

      {filteredAssets.length ? (
        <div className="mt-5 grid grid-cols-4 gap-3.5">
          {filteredAssets.map((asset) => (
            <button key={asset.id} type="button" className="group mesh-focus-ring overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c100e]/84 text-left shadow-[0_14px_38px_rgba(0,0,0,0.24)] transition-[border-color,transform] hover:-translate-y-1 hover:border-[#a9ff55]/24" onClick={(event) => { lastTriggerRef.current = event.currentTarget; setSelectedAsset(asset); }}>
              <span className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(61,100,75,0.18),transparent_60%),#070a08]">
                <ModelCapabilityVisual src={asset.image} alt={`${asset.title} 3D 模型`} mode={asset.mode} />
              </span>
              <span className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block text-[10px] tracking-[0.1em] text-[#a9ff55]/58">{categoryLabels[asset.category]}</span>
                  <strong className="mt-1 block truncate text-sm font-medium text-white/88">{asset.title}</strong>
                  <span className="mt-0.5 block truncate text-[11px] text-white/34">作者：{asset.creator}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-[11px] text-white/36">
                  <span className="flex items-center gap-1"><Heart className="size-3" />{asset.likes}</span>
                  <Eye className="size-3" aria-label="查看" />
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] text-center">
          <div>
            <Search className="mx-auto size-5 text-white/20" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-white/62">没有匹配的模型</p>
            <p className="mt-1 text-[9px] text-white/28">当前演示数据可能尚未覆盖这个分类。</p>
            <button type="button" className="mesh-focus-ring mt-4 rounded-full border border-white/10 px-4 py-2 text-[9px] text-white/52 hover:text-white" onClick={resetDiscovery}>清除搜索与筛选</button>
          </div>
        </div>
      )}

      {selectedAsset ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10" role="dialog" aria-modal="true" aria-labelledby="community-preview-title">
          <button type="button" aria-label="关闭模型预览" className="absolute inset-0 cursor-default bg-[#020403]/88 backdrop-blur-xl" onClick={closePreview} />
          <div className="relative z-10 grid h-[min(74vh,700px)] w-[min(86vw,1080px)] grid-cols-[minmax(0,1fr)_290px] overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d0b] shadow-[0_40px_140px_rgba(0,0,0,0.78)]">
            <div className="relative bg-[#060807]"><Image fill priority src={selectedAsset.image} alt={`${selectedAsset.title} 模型预览`} sizes="800px" className="object-contain p-10" /></div>
            <aside className="flex flex-col border-l border-white/[0.08] p-7">
              <button ref={closeButtonRef} type="button" aria-label="关闭预览" className="mesh-focus-ring ml-auto grid size-9 place-items-center rounded-full border border-white/10 text-white/55 hover:text-white" onClick={closePreview}><X className="size-4" /></button>
              <div className="mt-auto">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#a9ff55]/68">{categoryLabels[selectedAsset.category]} · {capabilityLabel(selectedAsset.mode)}</p>
                <h2 id="community-preview-title" className="mt-3 text-2xl font-semibold">{selectedAsset.title}</h2>
                <p className="mt-2 text-xs text-white/36">作者：{selectedAsset.creator}</p>
                <button type="button" className="mesh-focus-ring mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#a9ff55] px-4 py-3 text-xs font-semibold text-[#102008]">以此为灵感开始创作<ArrowRight className="size-3.5" /></button>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </section>
  );
}
