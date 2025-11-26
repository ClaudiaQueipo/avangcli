export function getCliLabel(cli: string): string {
  return cli === "frontend-cli" ? "Frontend CLI" : "Backend CLI"
}

export function getLangLabel(lang: string): string {
  return lang === "en" ? "English" : "Español"
}
