export function deserialize<T>(json: string): T {
  const obj = JSON.parse(json);
  return obj as T;
}
