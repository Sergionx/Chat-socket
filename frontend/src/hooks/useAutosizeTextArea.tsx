import { useEffect } from "react";

type HeightUnit = "px" | "rem" | "%" | "em" | "vh" | "vw" | "vmin" | "vmax";
interface AutosizeOptions {
  maxLines?: number;
  maxHeight?: number;
  heightUnit?: HeightUnit;
}

// TODO - Subirlo a npm
// TODO - Hacer un componente textarea que use esto por
export default function useAutosizeTextArea(
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  options: AutosizeOptions = {}
) {
  const { maxLines = 3, maxHeight, heightUnit = "px" } = options;

  useEffect(() => {
    if (!textAreaRef) return;

    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    textAreaRef.style.height = "0px";
    const scrollHeight = textAreaRef.scrollHeight;

    // We then set the height directly, outside of the render loop
    // Trying to set this with state or a ref will produce an incorrect value.
    let newHeight = `${scrollHeight + 2}px`;
    if (maxHeight) {
      newHeight = `min(${maxHeight}${heightUnit}, ${newHeight})`;
    } else if (maxLines) {
      newHeight = `min(${newHeight}, ${lineHeight(maxLines)})`;
    }
    textAreaRef.style.height = newHeight;
  }, [textAreaRef, value]);

  function lineHeight(lines: number) {
    const lineHeight = parseInt(getComputedStyle(textAreaRef!).lineHeight);
    const maxScrollHeight = lineHeight * lines;
    return `${maxScrollHeight}px`;
  }
}
