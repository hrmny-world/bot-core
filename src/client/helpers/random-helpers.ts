export function num(min = 0, max = 10): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function nums(min = 0, max = 10, howMany = 1, allowRepeats = true): number[] {
  const count = howMany < 1 ? 1 : howMany;
  if (allowRepeats) {
    return new Array(count).map(() => num(min, max));
  }

  const randomNums: Set<number> = new Set();
  while (randomNums.size < howMany) {
    randomNums.add(num(min, max));
  }

  return Array.from(randomNums);
}

export function choice(arr: any[] | string = []): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function choiceMany(arr: any[] = [], howMany = 1): any[] {
  return new Array(howMany).map(() => choice(arr));
}

export function float(): number {
  return Math.random();
}

export function floats(howMany = 1): number[] {
  const count = howMany < 1 ? 1 : howMany;
  return new Array(count).map(() => float());
}

export function letter(includeCaps = false): string {
  let letterPool = 'abcdefghijklmnopqrstuvwxyz';
  if (includeCaps) letterPool += letterPool.toUpperCase();

  return choice(letterPool);
}

export function letters(howMany = 1, includeCaps = false): string[] {
  const count = howMany < 1 ? 1 : Math.round(howMany);
  return new Array(count).map(() => letter(includeCaps));
}
