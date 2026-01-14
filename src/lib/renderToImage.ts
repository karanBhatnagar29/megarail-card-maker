import { toPng } from "html-to-image";

export type RenderedImage = {
  dataUrl: string;
  width: number;
  height: number;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * Renders a DOM node to a PNG data URL.
 * Uses html-to-image (more reliable than html2canvas for some layouts).
 */
export async function renderNodeToPng(
  node: HTMLElement,
  options?: { pixelRatio?: number; backgroundColor?: string }
): Promise<RenderedImage> {
  // Ensure webfonts are loaded before rasterizing.
  // (Supported in modern browsers.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (document as any).fonts?.ready?.catch?.(() => undefined);

  const pixelRatio = options?.pixelRatio ?? 3;
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio,
    backgroundColor: options?.backgroundColor ?? "#ffffff",
  });

  const img = await loadImage(dataUrl);
  return { dataUrl, width: img.naturalWidth, height: img.naturalHeight };
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
