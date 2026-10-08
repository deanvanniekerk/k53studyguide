import { type SectionIllustrationName, sectionIllustrations } from "@k53studyguide/shared/react";

export type IllustrationName =
  | SectionIllustrationName
  | "study-seen"
  | "study-progress"
  | "study-reset"
  | "quiz-star"
  | "quiz-points"
  | "quiz-settings"
  | "quiz-reset"
  | "test-shuffle"
  | "mock-tests"
  | "score-breakdown"
  | "repeat-practice"
  | "premium-trophy"
  | "quiz-success"
  | "quiz-practice"
  | "test-success"
  | "test-practice";

const sharedIllustrations: Partial<Record<IllustrationName, string>> = sectionIllustrations;

// Decorative artwork: the adjacent heading supplies the accessible label.
export const Illustration = ({ name, size }: { name: IllustrationName; size: number }) => (
  <img
    src={sharedIllustrations[name] ?? `/assets/images/illustrations/${name}.webp`}
    alt=""
    width={size}
    height={size}
    decoding="async"
    style={{ display: "block", objectFit: "contain", flexShrink: 0 }}
  />
);
