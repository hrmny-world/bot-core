export default function formatString(...args: any[]) {
  let mainString: string = args[0];
  const replacers: any[] = args.slice(1);

  for (const index in replacers) {
    if (mainString.includes(index)) {
      const exp = new RegExp(`\\{${index}\\}`, 'g');
      mainString = mainString.replace(exp, replacers[index]);
    }
  }
  return mainString;
}
