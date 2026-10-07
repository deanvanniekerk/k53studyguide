export type IllustrationName =
  | "study-seen"
  | "study-progress"
  | "study-reset"
  | "quiz-star"
  | "quiz-points"
  | "quiz-settings"
  | "quiz-reset"
  | "test-shuffle"
  | "vehicle-controls"
  | "road-rules"
  | "defensive-driving"
  | "road-markings"
  | "traffic-signals"
  | "road-signs"
  | "mock-tests"
  | "score-breakdown"
  | "repeat-practice"
  | "premium-trophy"
  | "quiz-success"
  | "quiz-practice"
  | "test-success"
  | "test-practice";

// Decorative artwork: the adjacent heading supplies the accessible label.
export const Illustration = ({ name, size }: { name: IllustrationName; size: number }) => (
  <img
    src={`/assets/images/illustrations/${name}.webp`}
    alt=""
    width={size}
    height={size}
    decoding="async"
    style={{ display: "block", objectFit: "contain", flexShrink: 0 }}
  />
);
