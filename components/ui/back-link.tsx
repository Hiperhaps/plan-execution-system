import Link from "next/link";

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#0f766e] transition hover:text-[#115e59]"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
