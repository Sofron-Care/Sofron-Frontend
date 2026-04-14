export const toNumber = (value: any) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

export const currency = (value: any) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(toNumber(value));
