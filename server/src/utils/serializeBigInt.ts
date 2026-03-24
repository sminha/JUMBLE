export const serializeBigInt = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (typeof data === "bigint") {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeBigInt);
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializeBigInt(value)]),
    );
  }

  return data;
};
