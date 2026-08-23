import {
  Bell,
  Boxes,
  ChevronDown,
  Crown,
  Gift,
  HelpCircle,
  Menu,
  PanelRightOpen,
  Sparkles,
  Zap,
} from "lucide-react";

const iconButtonClassName =
  "relative grid size-[34px] place-items-center rounded-full text-[#9ca5a0] transition-colors duration-200 hover:bg-white/[0.06] hover:text-[#f2f5f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9ff5a]/70";

const navItems = ["社区", "API", "资源", "创意工坊"] as const;

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#080a09]/86 pl-4 pr-5 text-[#f3f5f3] backdrop-blur-xl">
      <div className="flex h-full items-center gap-2.5">
        <button
          type="button"
          aria-label="打开主菜单"
          className={iconButtonClassName}
        >
          <Menu aria-hidden="true" className="size-[19px]" strokeWidth={1.8} />
        </button>

        <a
          href="#workspace"
          aria-label="Meshy 工作台首页"
          className="group flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9ff5a]/70"
        >
          <span className="grid size-8 place-items-center rounded-[10px] border border-[#b9ff5a]/25 bg-[#b9ff5a]/10 text-[#c8ff78] shadow-[0_0_22px_rgba(185,255,90,0.1)] transition-colors group-hover:bg-[#b9ff5a]/15">
            <Boxes aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.025em]">
            Meshy
          </span>
        </a>

        <nav aria-label="主导航" className="ml-4 flex h-full items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className="mesh-focus-ring inline-flex h-[34px] items-center gap-1 rounded-lg px-3 text-[14px] font-medium text-[#aab3ad] transition hover:bg-white/[0.045] hover:text-white"
            >
              {item}
              {item === "资源" ? <ChevronDown aria-hidden="true" className="size-3.5 text-white/32" /> : null}
            </button>
          ))}
        </nav>
      </div>

      <nav aria-label="账户与通知" className="flex items-center gap-1.5">
        <button
          type="button"
          className="mesh-focus-ring inline-flex h-[34px] items-center gap-2 rounded-lg px-3 text-[14px] font-medium text-[#dfe5df] transition hover:bg-white/[0.045]"
        >
          <Zap aria-hidden="true" className="size-4 text-[#b9ff5a]" strokeWidth={1.8} />
          Agent
        </button>

        <div className="flex h-[34px] overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035]">
          <button
            type="button"
            className="mesh-focus-ring inline-flex h-full items-center gap-2 px-3 text-[14px] font-medium text-[#eef3ef] transition hover:bg-white/[0.055]"
          >
            <PanelRightOpen aria-hidden="true" className="size-4 text-white/48" strokeWidth={1.8} />
            工作区
          </button>
          <button
            type="button"
            aria-label="打开工作区菜单"
            className="mesh-focus-ring grid h-full w-8 place-items-center border-l border-white/[0.08] text-white/42 transition hover:bg-white/[0.055] hover:text-white/72"
          >
            <ChevronDown aria-hidden="true" className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          aria-label="查看积分，当前 210 点"
          className="inline-flex h-[34px] items-center gap-2 rounded-full border border-[#b9ff5a]/20 bg-[#b9ff5a]/[0.08] px-3 text-xs font-semibold text-[#d4ff99] transition-colors hover:border-[#b9ff5a]/35 hover:bg-[#b9ff5a]/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9ff5a]/70"
        >
          <Sparkles aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          <span>210</span>
        </button>

        <button
          type="button"
          aria-label="查看会员权益"
          className="mesh-focus-ring inline-flex h-[34px] items-center rounded-full border border-[#9f8cff]/18 bg-[#9f8cff]/10 px-3 text-xs font-semibold text-[#d8ceff] transition hover:border-[#b7a8e9]/36 hover:bg-[#9f8cff]/15"
        >
          升级
          <Crown aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          aria-label="查看礼物"
          className={iconButtonClassName}
        >
          <Gift aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#b9ff5a] shadow-[0_0_7px_rgba(185,255,90,0.8)]" />
        </button>

        <button
          type="button"
          aria-label="打开帮助"
          className={iconButtonClassName}
        >
          <HelpCircle aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          aria-label="查看通知，有新消息"
          className={iconButtonClassName}
        >
          <Bell aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#ff756f] shadow-[0_0_7px_rgba(255,117,111,0.6)]" />
        </button>

        <button
          type="button"
          aria-label="打开 rosyy6778 的账户菜单"
          className="ml-1 grid size-[34px] place-items-center rounded-full border border-white/15 bg-gradient-to-br from-[#c8ff78] via-[#7ddfaf] to-[#7489ea] text-[12px] font-bold text-[#08100c] shadow-[0_0_0_3px_rgba(255,255,255,0.025)] transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9ff5a]/70"
        >
          R
        </button>
      </nav>
    </header>
  );
}
