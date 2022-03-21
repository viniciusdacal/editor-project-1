export const parseJSON = <T>(str: string): string | T => {
  if (!str) {
    return str;
  }

  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};
