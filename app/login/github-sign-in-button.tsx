"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type GitHubSignInButtonProps = {
  callbackUrl: string;
};

export function GitHubSignInButton({ callbackUrl }: GitHubSignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      className="btn-primary login-button"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        void signIn("github", { callbackUrl });
      }}
    >
      {isPending ? "正在跳转..." : "使用 GitHub 登录"}
    </button>
  );
}
