import { createRoot, type Root } from "react-dom/client";
import Snowfall from "./snowfall";

let root: Root | null = null;

export function mount(element: HTMLElement) {
  if (!element || root) return;
  const color = element.dataset.color || "#ffffff";
  const count = window.matchMedia("(max-width: 720px)").matches ? 240 : 500;
  root = createRoot(element);
  root.render(
    <Snowfall color={color} count={count} opacityMin={20} opacityMax={65} />
  );
}

export function unmount() {
  if (!root) return;
  root.unmount();
  root = null;
}
