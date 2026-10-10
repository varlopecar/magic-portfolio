import { useSyncExternalStore } from "react";

type HeadingLink = {
  id: string;
  text: string;
  level: number;
};

const emptyHeadings: HeadingLink[] = [];
let cachedHeadings = emptyHeadings;
let cachedKey = "";

function readHeadings() {
  const elements = Array.from(document.querySelectorAll("h2, h3, h4, h5, h6"))
    .filter((elem) => !elem.hasAttribute("data-exclude-nav"))
    .map((elem, index) => ({
      id: elem.id || `heading-${index}`,
      text: elem.textContent || "",
      level: Number(elem.tagName.substring(1)),
    }));
  const key = elements
    .map((heading) => `${heading.level}:${heading.id}:${heading.text}`)
    .join("\n");

  if (key === cachedKey) {
    return cachedHeadings;
  }

  cachedKey = key;
  cachedHeadings = elements;
  return cachedHeadings;
}

function subscribe() {
  return () => {};
}

export const useHeadingLinks = () => {
  return useSyncExternalStore(subscribe, readHeadings, () => emptyHeadings);
};
