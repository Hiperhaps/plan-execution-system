import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AuthenticationError } from "@/lib/auth-errors";
import { ResourceNotFoundError } from "@/lib/resource-errors";

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      message: "请求参数不正确",
      issues: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}

export function notFoundResponse(message = "资源不存在") {
  return NextResponse.json({ message }, { status: 404 });
}

export function badRequestResponse(message = "请求不正确") {
  return NextResponse.json({ message }, { status: 400 });
}

export function serverErrorResponse(message = "服务器错误") {
  return NextResponse.json({ message }, { status: 500 });
}

export function unauthorizedResponse(message = "请先登录后再继续操作") {
  return NextResponse.json({ message }, { status: 401 });
}

export function isRecordNotFound(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export function isForeignKeyConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  );
}

export function handleApiError(
  error: unknown,
  {
    fallbackMessage = "服务器错误",
    notFoundMessage,
  }: {
    fallbackMessage?: string;
    notFoundMessage?: string;
  } = {},
) {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof SyntaxError) {
    return badRequestResponse("请求体不是合法 JSON");
  }

  if (error instanceof AuthenticationError) {
    return unauthorizedResponse(error.message);
  }

  if (error instanceof ResourceNotFoundError) {
    return notFoundResponse(notFoundMessage ?? error.message);
  }

  if (
    notFoundMessage &&
    (isRecordNotFound(error) || isForeignKeyConstraintError(error))
  ) {
    return notFoundResponse(notFoundMessage);
  }

  return serverErrorResponse(fallbackMessage);
}
