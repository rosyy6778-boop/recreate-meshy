"use client";

import { useState } from "react";

import { CreationCommandCenter } from "@/components/meshy/creation-command-center";
import type { ManagedProject } from "@/components/meshy/project-demo-types";
import { ContinueWorkBoard } from "@/components/meshy/surround-gallery";

export function WorkspaceExperience() {
  const [createdProject, setCreatedProject] = useState<ManagedProject | null>(null);

  function handleProjectCreated(project: ManagedProject) {
    setCreatedProject(project);
    window.requestAnimationFrame(() => {
      document.getElementById("continue-work")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      <div id="workspace" className="relative z-[30] mx-auto w-[720px] pt-3">
        <CreationCommandCenter onProjectCreated={handleProjectCreated} />
      </div>

      <div className="relative z-20">
        <ContinueWorkBoard key={createdProject?.id ?? "existing-work"} createdProject={createdProject} />
      </div>
    </>
  );
}
