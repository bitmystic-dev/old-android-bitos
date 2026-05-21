export async function getVersion(): Promise<string> {
  try {
    const response = await fetch("/version.txt");
    return (await response.text()).trim();
  } catch {
    return "unknown";
  }
}
