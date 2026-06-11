type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

function normalizeCallbackUrl(value?: string) {
  if (!value || !value.startsWith("/")) {
    return "/";
  }

  if (value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl = normalizeCallbackUrl((await searchParams).callbackUrl);
  const signInHref = `/api/auth/signin/github?callbackUrl=${encodeURIComponent(
    callbackUrl,
  )}`;

  return (
    <main className="login-shell">
      <section className="login-panel">
        <p className="page-kicker">Secure Workspace</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-[#f7faf7]">
          登录计划执行系统
        </h1>
        <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-[#b8c1bd]">
          使用 GitHub 登录后，你的目标、任务、复盘和 AI 生成计划会绑定到当前账号，
          在不同设备上保持同步，并与其他用户隔离。
        </p>

        <div className="mt-8">
          <a href={signInHref} className="btn-primary login-button">
            使用 GitHub 登录
          </a>
        </div>
      </section>
    </main>
  );
}
