import { setupIonicReact } from "@ionic/react";
import { createRoot } from "react-dom/client";
import { Provider as TranslationProvider } from "@k53studyguide/shared/translation";
import { translations } from "@k53studyguide/shared/data";
import "../../app/src/theme/variables.css";
import "./quiz-demo.css";
import { QuizDemoDialog } from "./quiz-demo/QuizDemoDialog";

setupIonicReact({
  mode: "md",
});

export const mountDemo = (location: string) => {
  const rootElement = document.getElementById("quiz-demo-root");
  if (!rootElement) throw new Error("Quiz demo container missing");
  createRoot(rootElement).render(
    <TranslationProvider language="en" translation={translations}>
      <QuizDemoDialog initialLocation={location} />
    </TranslationProvider>,
  );
}
