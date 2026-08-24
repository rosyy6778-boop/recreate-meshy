export type ProjectAsset = {
  id: string;
  title: string;
  status: "completed" | "next" | "waiting";
  image: string;
  note: string;
};

export type ManagedProject = {
  id: string;
  title: string;
  meta: string;
  completed: number;
  total: number;
  nextStep: string;
  assets: ProjectAsset[];
  contextTags?: string[];
  contextNote?: string;
  statusText?: string;
};
