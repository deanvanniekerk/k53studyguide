import { QuizQuestionCard as SharedQuizQuestionCard } from "@k53studyguide/shared/react";
import type { ComponentProps } from "react";
import { assetUrl } from "@/app/assetUrl";

/** The shared card also serves the website; the app owns its asset mount. */
export const QuizQuestionCard = (props: ComponentProps<typeof SharedQuizQuestionCard>) => (
  <SharedQuizQuestionCard {...props} imageAssetBaseUrl={assetUrl("images")} />
);
