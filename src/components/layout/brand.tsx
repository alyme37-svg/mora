import Link from "next/link";

export function Brand() {
  return (
    <Link
      href="/"
      className="group inline-flex min-h-11 items-center gap-2.5"
      aria-label="MORA home"
    >
      <span
        aria-hidden="true"
        className="relative block size-6 shrink-0 text-walnut"
      >
        <span className="absolute left-0.5 top-1 size-3.5 rounded-full border border-current transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none" />
        <span className="absolute bottom-1 right-0.5 size-3.5 rounded-full border border-current bg-gold/20 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-walnut" />
      </span>
      <span className="font-serif text-[2rem] font-bold leading-none tracking-[-0.055em]">
        Mora
      </span>
    </Link>
  );
}
