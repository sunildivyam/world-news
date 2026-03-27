export function success<T>(data: T, meta = {}) {
  return Response.json({
    success: true,
    data,
    meta,
  });
}

export function error(message: string, code = 400) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status: code },
  );
}
