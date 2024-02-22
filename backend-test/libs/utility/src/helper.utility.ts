export function commaize(v: number | string): string {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function safeJsonStringify(obj: any): string | undefined {
  try {
    return JSON.stringify(obj);
  }
  catch (e) {
    return undefined;
  }
}
