"use client";

import Image from "next/image";
import {
  AlertTriangle, Bot, Box, Check, CheckCircle2, ChevronDown, CircleHelp,
  Coins, ImagePlus, Layers3, Paperclip, Puzzle, ShieldCheck,
  SlidersHorizontal, Sparkles, Upload, WandSparkles, X,
} from "lucide-react";
import {
  useEffect, useRef, useState,
  type ChangeEvent, type FocusEvent, type ReactNode,
} from "react";

type TaskMode = "asset" | "project";
type InputMode = "reference" | "agent";
type DetailLevel = "standard" | "high";
type ReadinessLevel = "ready" | "review" | "replace";
type ModeCopy = { eyebrow: string; title?: string; description?: string; placeholder?: string };
type AgentTool = { id: string; label: string; description: string };
type AgentToolGroup = { title: string; items: AgentTool[] };
type ImageCheck = {
  width: number; height: number; sharpness: number;
  resolutionOkay: boolean; clarityOkay: boolean; framingOkay: boolean;
  readiness: ReadinessLevel;
};
type AgentAttachment = { id: string; name: string; preview: string; check: ImageCheck | null };

const projectStages = [
  "理清概念", "确定风格与参考", "拆分资产清单", "安排生成顺序",
  "制作与版本筛选", "贴图、PBR 与骨骼绑定", "质量检查与导出",
] as const;

const assetToolGroups: AgentToolGroup[] = [
  {
    title: "创意模板",
    items: [
      { id: "chibi", label: "Chibi 手办", description: "将角色转为头身比例夸张的收藏手办。" },
      { id: "brick", label: "砖块人物", description: "生成积木结构和方块比例角色。" },
      { id: "magnet", label: "冰箱磁贴", description: "把主体做成适合平面展示的浮雕磁贴。" },
      { id: "capsule-toy", label: "扭蛋玩具", description: "生成适合小型收藏玩具的圆润造型。" },
      { id: "low-poly", label: "Low Poly", description: "用较少面数保留清晰轮廓。" },
      { id: "realistic", label: "写实模型", description: "强化真实比例、材质与表面细节。" },
      { id: "anime", label: "动漫角色", description: "使用动漫比例和风格化面部特征。" },
      { id: "toy-style", label: "玩具风格", description: "生成圆润、简化且适合展示的玩具造型。" },
    ],
  },
  {
    title: "生产工具",
    items: [
      { id: "game-check", label: "游戏资产基础检查", description: "检查面数、UV、材质、法线和骨骼，给出优先修复建议。" },
      { id: "print-check", label: "3D 打印基础检查", description: "检查封闭性、非流形、薄壁和悬空风险。" },
      { id: "pbr-complete", label: "PBR 材质补全", description: "检查并补齐基础色、粗糙度、金属度和法线贴图。" },
      { id: "rig", label: "骨骼绑定", description: "为角色建立骨架，准备姿势和动作测试。" },
      { id: "components", label: "组件拆分", description: "将整体模型拆成可独立编辑的部件。" },
    ],
  },
];

const projectTemplates: AgentTool[] = [
  { id: "animated-character", label: "制作可动画角色", description: "从造型和贴图推进到骨骼绑定与动作测试。" },
  { id: "product-visual", label: "验证产品外观方案", description: "整理外观方案、组件关系与对比视图。" },
  { id: "game-props", label: "制作一套游戏道具", description: "保持风格比例一致并追踪每件道具进度。" },
  { id: "scene-assets", label: "拆解场景并制作资产", description: "识别场景主要物件，确认清单后安排建模。" },
];

const assetSuggestions = ["适合游戏的机械角色", "做成 Low Poly 展示模型"] as const;
const projectSuggestions = ["一套游戏角色和道具", "产品系列概念验证"] as const;

const modeCopy: Record<`${TaskMode}-${InputMode}`, ModeCopy> = {
  "asset-reference": { eyebrow: "图生 3D", title: "上传图片，生成单个 3D 资产", description: "拖入主体清晰的图片，或点击选择文件。" },
  "asset-agent": { eyebrow: "智能助理生成", placeholder: "描述你想制作的模型，例如：做一个可用于游戏的机械角色，需要低面拓扑、PBR 材质，并准备骨骼绑定。" },
  "project-reference": { eyebrow: "从参考图开始", title: "添加项目参考图", description: "用关键视觉确定项目中的资产、风格与方向。" },
  "project-agent": { eyebrow: "让智能助理规划项目", placeholder: "只有模糊想法也可以，例如：我想做一套蒸汽朋克城市资产。智能助理会追问用途、风格和交付要求，再帮你理清概念、拆分资产与安排制作顺序。" },
};

const detailOptions = [
  {
    id: "standard" as const, label: "标准模式", badge: "推荐探索", speed: "速度较快",
    image: "/images/meshy-gallery/low-poly-robot.jpg", imageAlt: "标准模式生成的低面机械角色示例",
    summary: "快速确认造型方向，适合先多试几版。", audience: "灵感探索、初稿和远景模型",
    geometry: "保留主要轮廓，简化细小结构", material: "基础颜色与材质，可继续编辑", cost: "额度消耗较低",
  },
  {
    id: "high" as const, label: "高细节模式", badge: "近景 / 交付", speed: "速度较慢",
    image: "/images/meshy-gallery/robot-danigmos.jpg", imageAlt: "高细节模式生成的精细机械角色示例",
    summary: "强化表面结构与材质，适合确认方向后使用。", audience: "产品近景、作品集和正式交付",
    geometry: "更多小结构，转折与接缝更清楚", material: "更精细贴图，便于继续制作 PBR", cost: "额度消耗较高",
  },
];

function measureSharpness(bitmap: ImageBitmap) {
  const canvas = document.createElement("canvas");
  const width = 96;
  const height = Math.max(48, Math.round((bitmap.height / bitmap.width) * width));
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return 0;
  context.drawImage(bitmap, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const luminance = (i: number) => pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
  let difference = 0;
  let samples = 0;
  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const i = (y * width + x) * 4;
      difference += Math.abs(luminance(i) - luminance(i + 4));
      difference += Math.abs(luminance(i) - luminance(i + width * 4));
      samples += 2;
    }
  }
  return samples ? difference / samples : 0;
}

async function inspectImage(file: File): Promise<ImageCheck | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const shortestEdge = Math.min(bitmap.width, bitmap.height);
    const aspectRatio = bitmap.width / bitmap.height;
    const sharpness = measureSharpness(bitmap);
    const resolutionOkay = shortestEdge >= 1024;
    const clarityOkay = sharpness >= 10;
    const framingOkay = aspectRatio >= 0.55 && aspectRatio <= 1.8;
    const severeRisk = shortestEdge < 512 || sharpness < 5;
    const result: ImageCheck = {
      width: bitmap.width, height: bitmap.height, sharpness,
      resolutionOkay, clarityOkay, framingOkay,
      readiness: severeRisk ? "replace" : resolutionOkay && clarityOkay && framingOkay ? "ready" : "review",
    };
    bitmap.close();
    return result;
  } catch {
    return null;
  }
}

function HelpPopover({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  function blur(event: FocusEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocusCapture={() => setOpen(true)} onBlurCapture={blur}>
      <button type="button" aria-label={label} aria-expanded={open} className="mesh-focus-ring grid size-8 place-items-center rounded-full border border-white/[0.09] bg-black/20 text-white/42 transition hover:border-[#a9ff55]/30 hover:text-[#c9ff96]">
        <CircleHelp className="size-4" aria-hidden="true" />
      </button>
      {open ? <span className="absolute right-0 top-[calc(100%+8px)] z-50 w-[290px] rounded-xl border border-white/10 bg-[#0b0e0c]/98 p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl"><strong className="block text-sm text-white/90">{title}</strong><span className="mt-2 block text-xs leading-5 text-white/58">{children}</span></span> : null}
    </span>
  );
}

function ReadinessBadge({ check }: { check: ImageCheck | null }) {
  if (!check) return <span className="text-[11px] text-[#ff9d95]">无法读取，请更换图片</span>;
  const copy = check.readiness === "ready" ? "图片可用" : check.readiness === "review" ? "建议调整后使用" : "建议更换图片";
  const color = check.readiness === "ready" ? "text-[#baff83]" : check.readiness === "review" ? "text-[#ffc27a]" : "text-[#ff9d95]";
  return <span className={`flex items-center gap-1 text-[11px] font-medium ${color}`}>{check.readiness === "ready" ? <ShieldCheck className="size-3" /> : <AlertTriangle className="size-3" />}{copy}</span>;
}

export function CreationCommandCenter() {
  const [taskMode, setTaskMode] = useState<TaskMode>("asset");
  const [inputMode, setInputMode] = useState<InputMode>("reference");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("standard");
  const [detailOpen, setDetailOpen] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [imageCheck, setImageCheck] = useState<ImageCheck | null>(null);
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<AgentAttachment[]>([]);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const agentFileInputRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<AgentAttachment[]>([]);

  const copy = modeCopy[`${taskMode}-${inputMode}`];
  const isAgent = inputMode === "agent";
  const isProjectAgent = taskMode === "project" && isAgent;

  useEffect(() => { attachmentRef.current = attachments; }, [attachments]);
  useEffect(() => () => attachmentRef.current.forEach((item) => URL.revokeObjectURL(item.preview)), []);
  useEffect(() => {
    if (!detailOpen && !toolsOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setDetailOpen(false); setToolsOpen(false); } };
    const onPointer = (event: PointerEvent) => {
      if (detailOpen && !detailRef.current?.contains(event.target as Node)) setDetailOpen(false);
      if (toolsOpen && !toolsRef.current?.contains(event.target as Node)) setToolsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onPointer); };
  }, [detailOpen, toolsOpen]);

  function changeTaskMode(mode: TaskMode) { setTaskMode(mode); setInputMode("reference"); setPlanGenerated(false); setFeedback(null); }
  function changeInputMode(mode: InputMode) { setInputMode(mode); setPlanGenerated(false); setFeedback(null); }

  async function handleReferenceFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFile(file.name); setImageCheck(null); setRiskConfirmed(false); setFeedback(null);
    setImageCheck(await inspectImage(file));
  }

  async function handleAgentFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const next = await Promise.all(files.map(async (file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      check: await inspectImage(file),
    })));
    setAttachments((current) => [...current, ...next]);
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((item) => {
      if (item.id === id) URL.revokeObjectURL(item.preview);
      return item.id !== id;
    }));
  }

  function generate() {
    if (!isAgent && !uploadedFile) { setFeedback("请先上传参考图，系统会在消耗积分前检查图片可用性。"); return; }
    if (!isAgent && imageCheck?.readiness === "replace" && !riskConfirmed) { setFeedback("当前图片风险较高，请更换图片或确认了解风险后再继续。"); return; }
    if (isProjectAgent && !planGenerated) { setPlanGenerated(true); setFeedback(null); return; }
    if (isProjectAgent) { setFeedback("项目规划已确认：将创建 7 个可跟踪任务，具体生成前再确认积分。"); return; }
    setFeedback(`已接收：${taskMode === "asset" ? "单个资产" : "创建项目"} · ${isAgent ? agentPrompt.trim() || "待补充创作目标" : uploadedFile}`);
  }

  const inputChoices = taskMode === "asset"
    ? [["reference", "图生 3D", ImagePlus], ["agent", "智能助理", Bot]] as const
    : [["reference", "参考图开始", ImagePlus], ["agent", "智能规划", Bot]] as const;
  const needsRiskConfirm = !isAgent && imageCheck?.readiness === "replace" && !riskConfirmed;
  const actionLabel = needsRiskConfirm ? "先确认图片风险" : isAgent ? (isProjectAgent ? (planGenerated ? "创建 7 个任务" : "生成项目规划") : "启动智能助理") : taskMode === "asset" ? "生成资产" : "创建项目";
  const visibleToolGroups = isProjectAgent ? [{ title: "项目模板", items: projectTemplates }] : assetToolGroups;
  const selectedToolCopy = visibleToolGroups.flatMap((group) => group.items).find((item) => item.id === selectedTool);
  const toolButtonLabel = selectedToolCopy?.label ?? (isProjectAgent ? "项目模板" : "技能");
  const contextSuggestions = isProjectAgent ? projectSuggestions : assetSuggestions;

  return (
    <section className="mx-auto w-full max-w-[700px] pb-4 pt-5 text-white" aria-labelledby="creation-command-title">
      <h1 id="creation-command-title" className="text-center text-[32px] leading-10 font-medium tracking-[-0.045em]">嗨，rosyy6778！你要在 3D 中创建什么？</h1>
      <div className="mx-auto mt-4 flex w-fit items-center gap-2">
        <div className="flex items-center rounded-full border border-white/10 bg-black/42 p-1 shadow-[0_14px_34px_rgba(0,0,0,0.25)] backdrop-blur-xl" role="tablist" aria-label="任务类型">
          {([["asset", "单个资产", Box], ["project", "创建项目", Layers3]] as const).map(([mode, label, Icon]) => <button key={mode} type="button" role="tab" aria-selected={taskMode === mode} className={`mesh-focus-ring flex h-9 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${taskMode === mode ? "bg-white text-[#111511]" : "text-white/50 hover:text-white"}`} onClick={() => changeTaskMode(mode)}><Icon className="size-4" />{label}</button>)}
        </div>
        <HelpPopover label="为什么使用项目模式" title="什么时候切换到项目模式？">制作多个相关资产、保持统一风格，或只有模糊概念时，项目模式会帮你理清目标、拆分任务、安排依赖并保留上下文；只做一个独立模型时，单个资产更直接。</HelpPopover>
      </div>

      <div className="relative mx-auto mt-3 w-full">
        <nav className="absolute right-[calc(100%+12px)] top-0 w-[124px] py-1" aria-label="输入方式"><div className="space-y-2">{inputChoices.map(([mode, label, Icon]) => <button key={mode} type="button" aria-pressed={inputMode === mode} className={`mesh-focus-ring flex min-h-16 w-full items-start gap-2.5 rounded-xl border px-3 py-3 text-left text-xs font-medium leading-5 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl transition ${inputMode === mode ? "border-[#a9ff55]/38 bg-[#a9ff55]/10 text-[#d7ffb5]" : "border-white/[0.06] bg-[#0b0f0c]/52 text-white/48 hover:text-white/76"}`} onClick={() => changeInputMode(mode)}><Icon className="mt-0.5 size-4 shrink-0" />{label}</button>)}</div></nav>

        {isAgent ? (
          <div className={`relative flex min-w-0 flex-col rounded-[20px] border border-[#7899ff]/20 bg-[linear-gradient(145deg,rgba(82,127,255,0.07),rgba(169,255,85,0.03))] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl ${isProjectAgent && planGenerated ? "min-h-[270px]" : "min-h-[200px]"}`}>
            <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl border border-[#7899ff]/20 bg-[#668cff]/10 text-[#9bb2ff]"><Bot className="size-[18px]" /></span><span className="text-xs font-semibold tracking-[0.08em] text-[#a8bbff]/72">{copy.eyebrow}</span><span className="ml-auto"><HelpPopover label="查看图片上传建议" title="添加图片有什么帮助？">可选上传同一主体的多视图图片，帮助智能助理理解造型并提高模型精准度。系统只检查已上传图片的清晰度、尺寸和画幅是否可用，不要求凑齐固定视角。</HelpPopover></span></div>
            {isProjectAgent && planGenerated ? (
              <div className="mt-3 flex flex-1 flex-col rounded-xl border border-white/[0.08] bg-black/22 p-3.5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-semibold tracking-[0.1em] text-[#baff83]/68">项目计划预览</p><p className="mt-1.5 text-sm font-medium text-white/82">{agentPrompt.trim() || "从一个模糊的 3D 创作概念开始"}</p><p className="mt-1 text-[11px] text-white/38">确认前不会开始生成，也不会消耗积分。</p></div><button type="button" className="mesh-focus-ring rounded-full border border-white/10 px-3 py-2 text-[11px] text-white/48" onClick={() => setPlanGenerated(false)}>继续补充</button></div>
                <ol className="mt-3 grid grid-cols-2 gap-2">{projectStages.map((stage, index) => <li key={stage} className="flex items-center gap-2 rounded-lg bg-white/[0.035] px-3 py-2 text-[11px] text-white/58"><span className={`grid size-5 shrink-0 place-items-center rounded-full text-[9px] ${index === 0 ? "bg-[#a9ff55] font-semibold text-black" : "bg-white/[0.07] text-white/42"}`}>{index + 1}</span>{stage}</li>)}</ol>
              </div>
            ) : (
              <>
                <label className="sr-only" htmlFor="agent-task">描述智能助理需要完成的任务</label>
                <textarea id="agent-task" value={agentPrompt} rows={3} placeholder={copy.placeholder} className="mesh-focus-ring mt-3 min-h-[82px] flex-1 resize-none rounded-xl border border-white/[0.08] bg-black/22 px-4 py-3 text-sm leading-5 text-white/85 placeholder:text-white/30" onChange={(event) => { setAgentPrompt(event.target.value); setPlanGenerated(false); setFeedback(null); }} />
                {attachments.length ? <div className="mt-2 grid grid-cols-2 gap-2">{attachments.map((item) => <div key={item.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-black/22 p-2"><span className="relative size-11 shrink-0 overflow-hidden rounded-lg"><Image fill unoptimized src={item.preview} alt="已上传参考图预览" className="object-cover" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] text-white/70">{item.name}</span><ReadinessBadge check={item.check} /></span><button type="button" aria-label={`移除 ${item.name}`} className="mesh-focus-ring grid size-6 shrink-0 place-items-center rounded-full text-white/35 hover:bg-white/[0.06]" onClick={() => removeAttachment(item.id)}><X className="size-3" /></button></div>)}</div> : null}
                <div ref={toolsRef} className="mt-2" onPointerDown={(event) => event.stopPropagation()}>
                  <div className="flex min-w-0 items-center gap-2">
                    <input ref={agentFileInputRef} className="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" aria-label="添加智能助理参考图片" onChange={handleAgentFiles} />
                    <button type="button" className="mesh-focus-ring flex items-center gap-1.5 rounded-full border border-white/[0.09] px-3 py-2 text-xs text-white/52 hover:text-white/82" onClick={() => agentFileInputRef.current?.click()}><Paperclip className="size-3.5" />添加图片</button>
                    <button type="button" aria-expanded={toolsOpen} className={`mesh-focus-ring flex max-w-[170px] items-center gap-1.5 rounded-full border px-3 py-2 text-xs transition ${toolsOpen || selectedTool ? "border-[#a9ff55]/28 bg-[#a9ff55]/8 text-[#d2ffa9]" : "border-white/[0.09] text-white/52 hover:text-white/82"}`} onClick={() => setToolsOpen((value) => !value)}><Puzzle className="size-3.5 shrink-0" /><span className="truncate">{toolButtonLabel}</span></button>
                    <div className="ml-auto flex min-w-0 items-center gap-1.5">
                      <WandSparkles className="size-3.5 shrink-0 text-[#baff83]/55" />
                      {contextSuggestions.map((idea) => <button key={idea} type="button" className="mesh-focus-ring rounded-full border border-white/[0.08] px-3 py-1.5 text-[11px] text-white/42 hover:text-white/70" onClick={() => { setAgentPrompt(idea); setPlanGenerated(false); }}>{idea}</button>)}
                    </div>
                  </div>
                  {toolsOpen ? <div className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b0e0c]/88 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.45)]"><p className="px-1 text-sm font-semibold text-white/86">{isProjectAgent ? "选择项目模板" : "调用技能"}</p><p className="mt-1 px-1 text-[11px] text-white/38">{isProjectAgent ? "模板只辅助补全规划提示，确认前不会生成或消耗积分。" : "选择一个能力，智能助理会把它加入当前任务。"}</p><div className="mt-3 space-y-3">{visibleToolGroups.map((group) => <div key={group.title}><p className="px-1 pb-1.5 text-[11px] font-semibold tracking-[0.12em] text-[#a9ff55]/52">{group.title}</p><div className="grid grid-cols-2 gap-1.5">{group.items.map((item) => <button key={item.id} type="button" className={`mesh-focus-ring rounded-xl border px-3 py-2 text-left transition ${selectedTool === item.id ? "border-[#a9ff55]/35 bg-[#a9ff55]/9" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"}`} onClick={() => { setSelectedTool(item.id); if (isProjectAgent) setAgentPrompt(item.label); setPlanGenerated(false); setToolsOpen(false); }}><span className="block text-xs leading-5"><strong className="font-medium text-white/78">{item.label}</strong><span className="text-white/38"> — {item.description}</span></span></button>)}</div></div>)}</div></div> : null}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative flex min-h-[190px] min-w-0 items-center justify-center rounded-[20px] border border-dashed border-[#a9ff55]/25 bg-[linear-gradient(145deg,rgba(169,255,85,0.055),rgba(82,127,255,0.03))] px-5 py-4 shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <span className="absolute right-3 top-3"><HelpPopover label="查看参考图要求" title="什么样的图片更容易成功？">系统检查分辨率、清晰度和画幅风险。主体完整、无遮挡、背景简洁通常更容易成功；也可选传同一主体的多视图作为补充。</HelpPopover></span>
            <div className={`flex w-full flex-col ${imageCheck ? "items-stretch text-left" : "items-center text-center"}`}>
              <span className="grid size-10 place-items-center rounded-xl border border-[#a9ff55]/18 bg-[#a9ff55]/9 text-[#c2ff88]">{uploadedFile ? <ImagePlus className="size-5" /> : <Upload className="size-5" />}</span>
              <span className="mt-2 text-[11px] font-semibold tracking-[0.12em] text-[#c5ff91]/62">{copy.eyebrow}</span><h2 className="mt-1 text-base font-semibold text-white/90">{uploadedFile || copy.title}</h2>
              {imageCheck ? <div className="mt-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-3"><div className="flex items-center gap-2"><ReadinessBadge check={imageCheck} /><span className="ml-auto text-[11px] text-white/32">{imageCheck.width} × {imageCheck.height}</span></div><div className="mt-2 grid grid-cols-3 gap-2">{[["分辨率", imageCheck.resolutionOkay], ["清晰度", imageCheck.clarityOkay], ["画幅比例", imageCheck.framingOkay]].map(([label, passed]) => <span key={String(label)} className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] ${passed ? "bg-[#a9ff55]/[0.07] text-[#c5ff90]/68" : "bg-[#ff9b6c]/[0.07] text-[#ffc08b]/72"}`}>{passed ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}{String(label)}</span>)}</div>{imageCheck.readiness === "replace" && !riskConfirmed ? <button type="button" className="mesh-focus-ring mt-2 text-[11px] text-[#ffc08b]/78 underline" onClick={() => setRiskConfirmed(true)}>我了解风险，仍要继续</button> : null}</div> : <p className="mt-1.5 text-xs text-white/42">{copy.description}</p>}
              <input ref={fileInputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" aria-label="选择参考图片" onChange={handleReferenceFile} /><button type="button" className={`mesh-focus-ring mt-2.5 w-fit rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/72 ${imageCheck ? "self-start" : ""}`} onClick={() => fileInputRef.current?.click()}>{uploadedFile ? "更换图片" : "选择图片"}</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2.5">
        {feedback ? <p className="mr-auto flex min-w-0 items-center gap-1.5 text-xs text-[#c8ff98]/72" role="status"><Check className="size-3.5 shrink-0" /><span className="truncate">{feedback}</span></p> : null}
        {taskMode === "project" && !feedback ? <p className="mr-auto flex items-center gap-1.5 text-[11px] text-white/36"><ShieldCheck className="size-3.5 text-[#a9ff55]/50" />每个任务生成前单独确认细节等级与积分</p> : null}
        {taskMode === "asset" ? <div ref={detailRef} className="relative" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" className="mesh-focus-ring flex h-11 min-w-[150px] items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-[#101512]/88 px-3.5 text-left" aria-expanded={detailOpen} onClick={() => setDetailOpen((value) => !value)}><span className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-white/38" /><span><span className="block text-[10px] text-white/30">细节等级</span><span className="block text-xs font-medium text-white/76">{detailLevel === "standard" ? "标准模式" : "高细节模式"}</span></span></span><ChevronDown className={`size-3.5 text-white/32 ${detailOpen ? "rotate-180" : ""}`} /></button>
          {detailOpen ? <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[540px] rounded-[18px] border border-white/12 bg-[#0b0e0c]/98 p-3.5 shadow-[0_28px_90px_rgba(0,0,0,0.82)] backdrop-blur-2xl" role="dialog" aria-label="比较细节模式"><div className="mb-3 flex justify-between px-1"><div><p className="text-sm font-semibold">哪种模式适合我？</p><p className="mt-1 text-xs text-white/42">试想法选标准，确认方向后再使用高细节。</p></div><button type="button" aria-label="关闭模式比较" className="mesh-focus-ring grid size-7 place-items-center rounded-full text-white/35" onClick={() => setDetailOpen(false)}><X className="size-3.5" /></button></div><div className="grid grid-cols-2 gap-3">{detailOptions.map((option) => <button key={option.id} type="button" aria-pressed={detailLevel === option.id} className={`mesh-focus-ring group overflow-hidden rounded-2xl border text-left ${detailLevel === option.id ? "border-[#a9ff55]/52 bg-[#a9ff55]/[0.06]" : "border-white/[0.08] bg-white/[0.02]"}`} onClick={() => { setDetailLevel(option.id); setDetailOpen(false); }}><span className="relative block h-[88px] overflow-hidden border-b border-white/[0.06] bg-[#070907]"><Image fill src={option.image} alt={option.imageAlt} sizes="260px" className="object-contain p-2" /><span className="absolute left-2 top-2 rounded-full bg-black/64 px-2 py-1 text-[10px]">{option.badge}</span>{detailLevel === option.id ? <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-[#a9ff55] text-black"><Check className="size-3.5" /></span> : null}</span><span className="block p-3"><span className="flex justify-between"><strong className="text-sm">{option.label}</strong><span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-white/48">{option.speed}</span></span><span className="mt-1.5 block text-[11px] leading-5 text-white/48">{option.summary}</span><span className="mt-2 block space-y-1 border-t border-white/[0.06] pt-2 text-[11px] leading-5 text-white/52"><span className="block"><b className="text-white/72">适合：</b>{option.audience}</span><span className="block"><b className="text-white/72">几何：</b>{option.geometry}</span><span className="block"><b className="text-white/72">贴图：</b>{option.material}</span><span className="block text-[#baff84]/65">{option.cost}</span></span></span></button>)}</div></div> : null}
        </div> : null}
        <button type="button" className="mesh-focus-ring flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-xl bg-[#a9ff55] px-4 text-xs font-semibold text-[#102008] shadow-[0_0_28px_rgba(169,255,85,0.14)] transition hover:-translate-y-0.5" onClick={generate}>{feedback ? <Check className="size-4" /> : <Sparkles className="size-4" />}<span>{feedback ? "已接收" : actionLabel}</span>{!isAgent && taskMode === "asset" && !feedback ? <span className="flex items-center gap-1 border-l border-black/15 pl-2 text-[10px] font-medium text-black/60"><Coins className="size-3" />预计 20</span> : null}</button>
      </div>
    </section>
  );
}
