import { setupIonicReact } from "@ionic/react";
import { createRoot } from "react-dom/client";
import { Provider as TranslationProvider } from "react-translated";
import { translations } from "@k53studyguide/shared/data";
import "../../app/src/theme/variables.css";
import "./quiz-demo.css";
import { QuizDemoDialog } from "./quiz-demo/QuizDemoDialog";

setupIonicReact({
  mode: "md",
});

const rootElement = document.getElementById("quiz-demo-root");

if (rootElement) {
  createRoot(rootElement).render(
    <TranslationProvider language="en" translation={translations}>
      <QuizDemoDialog />
    </TranslationProvider>,
  );
}
