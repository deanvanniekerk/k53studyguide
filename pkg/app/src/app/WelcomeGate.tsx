import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { IonContent, IonPage } from "@ionic/react";
import { matchDeviceLocale, type ReleasedLocale, releasedLocales, translations } from "@k53studyguide/shared/data";
import { Translate, Provider as TranslationProvider } from "@k53studyguide/shared/translation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";
import styled from "styled-components";
import {
  completeWelcome,
  hasSavedLanguageSelector,
  languageSelector,
  type SettingsActions,
  welcomeCompletedSelector,
} from "@/state/settings";

export default function WelcomeGate({ children }: { children: ReactNode }) {
  const completed = useSelector(welcomeCompletedSelector);
  const language = useSelector(languageSelector);
  const hasSavedLanguage = useSelector(hasSavedLanguageSelector);
  const dispatch = useDispatch<Dispatch<SettingsActions>>();
  const [selected, setSelected] = useState<ReleasedLocale>(language as ReleasedLocale);
  const userSelected = useRef(false);

  useEffect(() => {
    if (completed || hasSavedLanguage) return;
    let active = true;
    async function suggest() {
      let suggested: ReleasedLocale = "en";
      try {
        const tags = Capacitor.isNativePlatform()
          ? [(await Device.getLanguageTag()).value]
          : navigator.languages.length
            ? navigator.languages
            : [navigator.language];
        suggested = matchDeviceLocale(tags);
      } catch {
        /* English is the initial suggestion if the bridge is unavailable. */
      }
      if (active && !userSelected.current) setSelected(suggested);
    }
    void suggest();
    return () => {
      active = false;
    };
  }, [completed, hasSavedLanguage]);

  if (completed) return <>{children}</>;

  return (
    <TranslationProvider language={selected} translation={translations}>
      <IonPage>
        <IonContent fullscreen>
          <Welcome lang={selected}>
            <Brand aria-hidden="true">K53</Brand>
            <h1>
              <Translate text="welcomeTitle" />
            </h1>
            <p>
              <Translate text="welcomeBody" />
            </p>
            <Languages>
              <legend>
                <Translate text="welcomeLanguage" />
              </legend>
              {releasedLocales.map(({ code, name }) => (
                <Choice key={code} $selected={selected === code}>
                  <input
                    type="radio"
                    name="language"
                    value={code}
                    checked={selected === code}
                    onChange={() => {
                      userSelected.current = true;
                      setSelected(code);
                    }}
                  />
                  <span lang={code}>{name}</span>
                </Choice>
              ))}
            </Languages>
            <p>
              <Translate text="welcomeChangeLanguage" />
            </p>
            <Continue
              type="button"
              onClick={() => {
                userSelected.current = true;
                dispatch(completeWelcome(selected));
              }}
            >
              <Translate text="welcomeContinue" />
            </Continue>
          </Welcome>
        </IonContent>
      </IonPage>
    </TranslationProvider>
  );
}

const Welcome = styled.main`
  max-width: 480px;
  margin: auto;
  padding: calc(var(--app-safe-area-top) + 32px) 24px calc(var(--app-safe-area-bottom) + 32px);
  color: var(--app-text-primary);
  h1 { font-size: 2rem; line-height: 1.15; margin: 24px 0 16px; }
  p { color: var(--app-text-muted); line-height: 1.5; }
`;
const Brand = styled.div`
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 24px;
  background: var(--app-study-primary-gradient);
  color: white;
  font-weight: 900;
  font-size: 1.5rem;
`;
const Languages = styled.fieldset`
  border: 0;
  margin: 28px 0;
  padding: 0;
  legend { font-weight: 800; margin-bottom: 12px; }
`;
const Choice = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 2px solid ${(p) => (p.$selected ? "var(--ion-color-primary)" : "var(--app-card-border-color, #ddd)")};
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  input { width: 20px; height: 20px; accent-color: var(--ion-color-primary); }
  &:focus-within { outline: 2px solid var(--ion-color-primary); outline-offset: 2px; }
`;
const Continue = styled.button`
  width: 100%;
  min-height: 56px;
  padding: 16px;
  border: 0;
  border-radius: 16px;
  background: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
`;
