import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { IonContent, IonFooter, IonIcon, IonPage } from "@ionic/react";
import { matchDeviceLocale, type ReleasedLocale, releasedLocales, translations } from "@k53studyguide/shared/data";
import { Translate, Provider as TranslationProvider } from "@k53studyguide/shared/translation";
import { arrowForward } from "ionicons/icons";
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
      <Page lang={selected}>
        <Content>
          <Welcome>
            <Illustration
              src="/assets/images/premium/open-road.webp"
              alt=""
              width={1536}
              height={1024}
              decoding="async"
            />
            <h1>
              <StableCopy text="welcomeTitle" selected={selected} />
            </h1>
            <Introduction>
              <StableCopy text="welcomeBody" selected={selected} />
            </Introduction>
            <Languages>
              <legend>
                <StableCopy text="welcomeLanguage" selected={selected} />
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
            <LanguageNote>
              <StableCopy text="welcomeChangeLanguage" selected={selected} />
            </LanguageNote>
          </Welcome>
        </Content>
        <Footer className="ion-no-border">
          <FooterContent>
            <Continue
              type="button"
              onClick={() => {
                userSelected.current = true;
                dispatch(completeWelcome(selected));
              }}
            >
              <Translate text="welcomeContinue" />
              <IonIcon icon={arrowForward} aria-hidden="true" />
            </Continue>
          </FooterContent>
        </Footer>
      </Page>
    </TranslationProvider>
  );
}

// Overlapping translations reserve the tallest copy at the current width and font size.
// Inactive copies still size the grid, but are hidden visually and from assistive technology.
function StableCopy({ text, selected }: { text: string; selected: ReleasedLocale }) {
  return (
    <CopyStack>
      {releasedLocales.map(({ code }) => (
        <CopyVariant key={code} lang={code} aria-hidden={code !== selected} $active={code === selected}>
          <TranslationProvider language={code} translation={translations}>
            <Translate text={text} />
          </TranslationProvider>
        </CopyVariant>
      ))}
    </CopyStack>
  );
}

const CopyStack = styled.span`
  display: grid;
`;
const CopyVariant = styled.span<{ $active: boolean }>`
  grid-area: 1 / 1;
  visibility: ${(p) => (p.$active ? "visible" : "hidden")};
`;

const Page = styled(IonPage)`
  --app-readable-content-max-width: 480px;
  background: var(--app-study-background);
  color: var(--app-text-primary);
`;
const Content = styled(IonContent)`
  --background: transparent;
`;
const Welcome = styled.main`
  box-sizing: border-box;
  max-width: 480px;
  margin: auto;
  padding: calc(var(--app-safe-area-top, 0px) + 12px) 24px 24px;

  h1 {
    margin: 8px 0;
    font-size: clamp(1.5rem, 6.5vw, 1.875rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.2;
    text-wrap: balance;
  }
`;
const Introduction = styled.p`
  margin: 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  line-height: 1.6;
`;
const Illustration = styled.img`
  display: block;
  width: 100%;
  height: clamp(140px, 23vh, 200px);
  object-fit: contain;

  @media (max-height: 650px) {
    height: 112px;
  }
`;
const Languages = styled.fieldset`
  min-width: 0;
  border: 0;
  margin: 12px 0 16px;
  padding: 0;

  legend {
    padding: 0;
    margin-bottom: 8px;
    font-size: var(--app-font-size-card-title);
    font-weight: 800;
  }
`;
const Choice = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 12px 16px;
  margin-bottom: 10px;
  border: 2px solid ${(p) => (p.$selected ? "var(--app-question-accent)" : "var(--app-card-border-color)")};
  border-radius: 20px;
  background: ${(p) => (p.$selected ? "var(--app-question-selected-background)" : "var(--app-card-background)")};
  cursor: pointer;
  font-size: var(--app-font-size-card-title);
  font-weight: 700;

  &:last-child { margin-bottom: 0; }
  input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: var(--app-progress-foreground);
  }
  &:has(input:focus-visible) { outline: 2px solid var(--app-question-accent); outline-offset: 3px; }
  @media (hover: hover) {
    &:hover { border-color: var(--app-progress-foreground); }
  }
`;
const LanguageNote = styled(Introduction)`
  font-size: var(--app-font-size-sm);
`;
const Footer = styled(IonFooter)`
  flex-shrink: 0;
  border-top: var(--app-card-border);
  background: var(--app-card-background);
  /* No tab bar on this screen, so the footer owns the home-indicator inset. */
  padding: 16px 24px calc(16px + max(env(safe-area-inset-bottom, 0px), var(--ion-safe-area-bottom, 0px)));
`;
const FooterContent = styled.div`
  max-width: 432px;
  margin: auto;
`;
const Continue = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 16px;
  border: 0;
  border-radius: var(--app-card-radius);
  background: var(--app-progress-foreground);
  color: #fff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  ion-icon { flex-shrink: 0; font-size: 20px; }
  &:active { opacity: 0.85; }
  &:focus-visible { outline: 2px solid var(--app-progress-foreground); outline-offset: 3px; }
`;
