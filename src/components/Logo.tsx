import Link from "next/link";

const PIXELS: [number, number][] = [
  [1, 0],
  [2, 0],
  [3, 0],
  [0, 1],
  [1, 2],
  [2, 2],
  [3, 3],
  [0, 4],
  [1, 4],
  [2, 4],
  [4, 0],
];

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Sipulsa"
    >
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="8" fill="#292F3D" />
        {PIXELS.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={9 + x * 4.4}
            y={8 + y * 4.8}
            width="4"
            height="4.4"
            fill={x === 4 ? "#FFFFFF" : "#F3E64B"}
          />
        ))}
      </svg>
      <span className="whitespace-nowrap text-[19px] font-extrabold tracking-[-0.05em]">
        si<span className="mut font-semibold">pulsa</span>
        <span className="ml-[2px] inline-block h-[15px] w-[7px] translate-y-[-1px] bg-[#F3E64B] shadow-[inset_0_0_0_1px_rgba(41,47,61,0.25)]" />
      </span>
    </Link>
  );
}
