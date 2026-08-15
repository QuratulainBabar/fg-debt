const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "" : "http://localhost:4000");

export async function downloadCsvExport(path: string, fileName: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("fg_debt_token") : null;
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const json = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(json.message || "Export failed.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
