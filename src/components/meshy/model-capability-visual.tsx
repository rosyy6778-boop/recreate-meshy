import Image from "next/image";

export type CapabilityMode = "rig" | "texture" | "components";

type ModelCapabilityVisualProps = {
  src: string;
  alt: string;
  mode: CapabilityMode;
};

const capabilityLabels: Record<CapabilityMode, string> = {
  rig: "骨骼结构示意",
  texture: "材质对比预览",
  components: "组件拆分示意",
};

const imageClassName =
  "pointer-events-none object-contain p-[10%] select-none drop-shadow-[0_18px_24px_rgba(0,0,0,0.42)]";

function ModelImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      fill
      draggable={false}
      src={src}
      alt={alt}
      sizes="(min-width: 1120px) 12vw, 180px"
      className={`${imageClassName} ${className}`}
    />
  );
}

function RigVisual({ src, alt }: Omit<ModelCapabilityVisualProps, "mode">) {
  return (
    <>
      <ModelImage
        src={src}
        alt={alt}
        className="transition duration-500 group-hover:brightness-[0.72] group-focus-visible:brightness-[0.72]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-[13%] size-[74%] scale-[0.94] opacity-0 drop-shadow-[0_0_5px_rgba(180,255,96,0.85)] transition duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        <g
          fill="none"
          stroke="#c7ff72"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.3"
          className="group-hover:animate-pulse group-focus-visible:animate-pulse motion-reduce:animate-none"
        >
          <path d="M50 17 50 34 50 52M50 28 34 40 23 54M50 28 66 40 77 54M50 52 38 70 34 88M50 52 62 70 66 88" />
          <path d="m42 38 8-4 8 4M42 67 50 72 58 67" opacity="0.58" />
        </g>
        {[
          [50, 17],
          [50, 34],
          [50, 52],
          [34, 40],
          [23, 54],
          [66, 40],
          [77, 54],
          [38, 70],
          [34, 88],
          [62, 70],
          [66, 88],
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={index === 0 ? 2.6 : 1.9}
            fill="#d7ff9d"
            stroke="#17210e"
            strokeWidth="0.8"
            className="origin-center group-hover:animate-pulse group-focus-visible:animate-pulse motion-reduce:animate-none"
          />
        ))}
      </svg>
    </>
  );
}

function TextureVisual({ src, alt }: Omit<ModelCapabilityVisualProps, "mode">) {
  return (
    <>
      <ModelImage
        src={src}
        alt={alt}
        className="grayscale brightness-[0.72] contrast-125 transition duration-700"
      />
      <ModelImage
        src={src}
        alt=""
        className="[clip-path:inset(0_100%_0_0)] transition-[clip-path,filter] duration-1000 ease-out group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[12%] left-[14%] top-[12%] w-px translate-x-0 bg-[#d0ff86] opacity-0 shadow-[0_0_10px_2px_rgba(169,255,85,0.55)] transition-[left,opacity] duration-1000 ease-out group-hover:left-[86%] group-hover:opacity-100 group-focus-visible:left-[86%] group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
    </>
  );
}

function ComponentsVisual({
  src,
  alt,
}: Omit<ModelCapabilityVisualProps, "mode">) {
  return (
    <>
      <ModelImage
        src={src}
        alt={alt}
        className="grayscale-[0.45] transition duration-500 group-hover:opacity-15 group-focus-visible:opacity-15"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-[16%] size-[68%] opacity-0 transition duration-500 group-hover:opacity-70 group-focus-visible:opacity-70 motion-reduce:transition-none"
      >
        <g fill="none" stroke="#baff76" strokeDasharray="2 3" strokeWidth="0.7">
          <path d="M50 48 29 25M50 48 71 25M50 48 25 68M50 48 75 69" />
        </g>
        <circle cx="50" cy="48" r="1.4" fill="#caff8b" />
      </svg>
      <ModelImage
        src={src}
        alt=""
        className="[clip-path:inset(8%_18%_58%_18%)] [mask-image:radial-gradient(ellipse_42%_48%_at_50%_50%,#000_58%,transparent_100%)] brightness-125 contrast-150 mix-blend-screen opacity-0 transition duration-500 group-hover:-translate-x-2.5 group-hover:-translate-y-3 group-hover:opacity-100 group-focus-visible:-translate-x-2.5 group-focus-visible:-translate-y-3 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
      <ModelImage
        src={src}
        alt=""
        className="[clip-path:inset(34%_50%_24%_12%)] [mask-image:radial-gradient(ellipse_42%_48%_at_50%_50%,#000_58%,transparent_100%)] brightness-125 contrast-150 mix-blend-screen opacity-0 transition duration-500 group-hover:-translate-x-4 group-hover:opacity-100 group-focus-visible:-translate-x-4 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
      <ModelImage
        src={src}
        alt=""
        className="[clip-path:inset(34%_12%_24%_50%)] [mask-image:radial-gradient(ellipse_42%_48%_at_50%_50%,#000_58%,transparent_100%)] brightness-125 contrast-150 mix-blend-screen opacity-0 transition duration-500 group-hover:translate-x-4 group-hover:opacity-100 group-focus-visible:translate-x-4 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
      <ModelImage
        src={src}
        alt=""
        className="[clip-path:inset(62%_20%_7%_20%)] [mask-image:radial-gradient(ellipse_42%_48%_at_50%_50%,#000_58%,transparent_100%)] brightness-125 contrast-150 mix-blend-screen opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:translate-y-3.5 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:translate-y-3.5 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
    </>
  );
}

export function ModelCapabilityVisual({
  src,
  alt,
  mode,
}: ModelCapabilityVisualProps) {
  return (
    <span className="absolute inset-0 block overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(79,105,90,0.18),transparent_66%)]">
      {mode === "rig" ? <RigVisual src={src} alt={alt} /> : null}
      {mode === "texture" ? <TextureVisual src={src} alt={alt} /> : null}
      {mode === "components" ? (
        <ComponentsVisual src={src} alt={alt} />
      ) : null}

      <span aria-hidden="true" className="absolute left-2 top-2 rounded-full border border-[#b9ff5a]/20 bg-[#071009]/75 px-2 py-1 text-[10px] font-semibold tracking-[0.1em] text-[#caff89]/75 opacity-0 shadow-[0_4px_14px_rgba(0,0,0,0.3)] backdrop-blur-sm transition duration-300 group-hover:border-[#b9ff5a]/40 group-hover:text-[#d8ffa6] group-hover:opacity-100 group-focus-visible:border-[#b9ff5a]/40 group-focus-visible:text-[#d8ffa6] group-focus-visible:opacity-100">
        {capabilityLabels[mode]}
      </span>
    </span>
  );
}
