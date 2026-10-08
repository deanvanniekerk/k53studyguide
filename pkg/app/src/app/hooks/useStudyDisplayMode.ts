import { type RefObject, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";
import { displayModeSelector, type SettingsActions, setInitialDisplayMode } from "@/state/settings";

export const useStudyDisplayMode = (
  content: Pick<HTMLIonContentElement, "getScrollElement"> | null,
  layout: RefObject<HTMLDivElement | null>,
) => {
  const dispatch = useDispatch<Dispatch<SettingsActions>>();
  const displayMode = useSelector(displayModeSelector);

  useEffect(() => {
    if (displayMode || !content) return;

    let cancelled = false;
    let observer: ResizeObserver | undefined;

    const measure = async () => {
      const scrollElement = await content.getScrollElement();
      // Text wrapping must use the loaded font before judging the page's fit.
      await document.fonts.ready;
      if (cancelled || !scrollElement || !layout.current) return;

      const chooseDefault = () => {
        if (cancelled || !layout.current) return;
        const availableHeight = scrollElement.clientHeight;
        const requiredHeight = layout.current.offsetHeight;
        // Ionic can mount a page before it is visible or has its final height.
        if (availableHeight === 0 || requiredHeight === 0) return;

        // Layout height excludes the entrance animations' transforms, unlike scrollHeight.
        dispatch(setInitialDisplayMode(requiredHeight <= availableHeight ? "comfortable" : "compact"));
      };

      observer = new ResizeObserver(chooseDefault);
      observer.observe(scrollElement);
      observer.observe(layout.current);
      chooseDefault();
    };

    void measure();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [content, dispatch, displayMode, layout]);
};
