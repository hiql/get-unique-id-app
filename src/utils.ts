export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export function isDigit(char: string): boolean {
  return /^\d$/.test(char);
}

export function isLetter(char: string): boolean {
  return /^[A-Za-z]$/.test(char);
}
