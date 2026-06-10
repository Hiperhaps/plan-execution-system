type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="panel-quiet border-dashed px-6 py-10">
      <div className="max-w-xl">
        <p className="page-kicker">Empty State</p>
        <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-[#6d746f]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
