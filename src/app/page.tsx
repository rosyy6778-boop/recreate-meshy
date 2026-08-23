import { ArrowUpRight, Sparkles } from "lucide-react";

import { CreationCommandCenter } from "@/components/meshy/creation-command-center";
import {
  CommunityGallery,
  ContinueWorkBoard,
} from "@/components/meshy/surround-gallery";
import { WorkspaceHeader } from "@/components/meshy/workspace-header";

export default function Home() {
  return (
    <main className="meshy-shell pb-28">
      <WorkspaceHeader />

      <section className="workflow-stage relative mx-auto w-full max-w-[1600px] overflow-hidden px-8 pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(119,255,137,0.12)_0%,rgba(65,130,255,0.055)_42%,transparent_72%)] blur-2xl"
        />

        <div id="workspace" className="relative z-[30] mx-auto w-[720px] pt-3">
          <CreationCommandCenter />
        </div>

        <div className="relative z-20">
          <ContinueWorkBoard />
        </div>
      </section>

      <CommunityGallery />

      <aside className="fixed bottom-5 right-6 z-40 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#151816]/92 p-2.5 shadow-[0_18px_54px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-xl bg-[#b8ff66] text-[#0b1109] shadow-[0_0_24px_rgba(184,255,102,0.24)]">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium text-white/84">生产级工作流</p>
            <p className="mt-0.5 text-[11px] text-white/38">额度、专业导出与私有资产</p>
          </div>
        </div>
        <button
          type="button"
          className="mesh-focus-ring flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-[#c4ff7f]"
        >
          升级
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </button>
      </aside>
    </main>
  );
}
