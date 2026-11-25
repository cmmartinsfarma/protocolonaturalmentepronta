import { createRoot, type Root } from "react-dom/client";
import Snowfall from "./snowfall";

let root: Root | null = null;

export function mount(element: HTMLElement) {
  if (!element || root) return;
  root = createRoot(element);
  root.render(<Snowfall />);
}

export function unmount() {
  if (!root) return;
  root.unmount();
  root = null;
}
