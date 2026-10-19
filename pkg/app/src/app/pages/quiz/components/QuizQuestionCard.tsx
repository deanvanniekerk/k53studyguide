import { QuizQuestionCard as SharedQuizQuestionCard } from "@k53studyguide/shared/react";
import type { ComponentProps } from "react";
import { assetUrl } from "@/app/assetUrl";
import { RetryableImage } from "@/app/components/RetryableImage";

/** The shared card also serves the website; the app owns its image behavior. */
export const QuizQuestionCard = (props: ComponentProps<typeof SharedQuizQuestionCard>) => (
  <SharedQuizQuestionCard {...props} imageAssetBaseUrl={assetUrl("images")} ImageComponent={RetryableImage} />
);
