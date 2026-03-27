export function isInvalidPath(
  pathname: string,
  allowedExtensions: string[] = [".xml"],
): boolean {
  const fileExtensionMatch = pathname.match(/\.[a-zA-Z0-9]+$/);

  if (!fileExtensionMatch) {
    return false;
  }

  const extension = fileExtensionMatch[0].toLowerCase();

  if (allowedExtensions.length === 0) {
    return true;
  }

  return !allowedExtensions.some(
    (ext) =>
      ext.toLowerCase() === extension ||
      ext.toLowerCase() === extension.slice(1),
  );
}
