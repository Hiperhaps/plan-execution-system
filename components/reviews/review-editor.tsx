"use client";

export function ReviewEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) {
  return (
    <section className="panel p-5">
      <div>
        <p className="page-kicker">Review Note</p>
        <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
          复盘内容
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6d746f]">
          可以直接编辑 AI 生成的内容，再保存为复盘记录。
        </p>
      </div>
      <textarea
        value={content}
        onChange={(event) => onChange(event.target.value)}
        className="field mt-5 min-h-80 leading-7"
        placeholder="点击 AI 生成复盘，或在这里手动填写本周复盘。"
      />
    </section>
  );
}
