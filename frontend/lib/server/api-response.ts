import { NextResponse } from "next/server";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: { message: string };
};

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function withApiResponse<T>(
  handler: () => T | Promise<T>,
  status = 200,
): Promise<NextResponse<ApiSuccess<T> | ApiFailure>> {
  try {
    return NextResponse.json({ success: true, data: await handler() }, { status });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: error.status },
      );
    }

    console.error("Erro inesperado na API do portal.", error);
    return NextResponse.json(
      { success: false, error: { message: "Ocorreu um erro interno." } },
      { status: 500 },
    );
  }
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError("O corpo da requisição deve conter um JSON válido.", 400);
  }
}
