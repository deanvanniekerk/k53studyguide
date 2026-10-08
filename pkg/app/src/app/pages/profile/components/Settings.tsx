import { IonSelect, IonSelectOption } from "@ionic/react";
import { releasedLocales } from "@k53studyguide/shared/data";
import { Translate, Translator } from "@k53studyguide/shared/translation";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import {
  type DisplayMode,
  displayModeSelector,
  languageSelector,
  recieveLanguage,
  setDisplayMode,
  setTheme,
  type Theme,
  themeSelector,
} from "@/state/settings";
import { GroupCard, Row, Section, SectionTitle } from "./";

type Props = PropsFromState & PropsFromDispatch;

const SettingsComponent: React.FC<Props> = (props) => {
  //Mini hack to get around to resetting issue....
  const [language, setLanguage] = useState(props.language);
  const [theme, setThemeLocal] = useState<Theme>(props.theme);

  return (
    <Section>
      <SectionTitle>
        <Translate text="settings" />
      </SectionTitle>
      <GroupCard>
        <Translator>
          {({ translate }) => (
            <React.Fragment>
              <Row
                name={translate({ text: "appearance" })}
                value={
                  <Select
                    value={theme}
                    onIonChange={(event) => {
                      const value = event.detail.value as Theme;
                      setThemeLocal(value);
                      props.setTheme(value);
                    }}
                    interface="action-sheet"
                    cancelText={translate({ text: "cancel" })}
                  >
                    <IonSelectOption value="system">
                      <Translate text="systemDefault" />
                    </IonSelectOption>
                    <IonSelectOption value="light">
                      <Translate text="lightTheme" />
                    </IonSelectOption>
                    <IonSelectOption value="dark">
                      <Translate text="darkTheme" />
                    </IonSelectOption>
                  </Select>
                }
              />
              <Row
                name={translate({ text: "displayMode" })}
                value={
                  <Select
                    aria-label={translate({ text: "displayMode" })}
                    value={props.displayMode ?? "comfortable"}
                    onIonChange={(event) => {
                      const value = event.detail.value as DisplayMode;
                      props.setDisplayMode(value);
                    }}
                    interface="action-sheet"
                    cancelText={translate({ text: "cancel" })}
                  >
                    <IonSelectOption value="compact">
                      <Translate text="compactDisplay" />
                    </IonSelectOption>
                    <IonSelectOption value="comfortable">
                      <Translate text="comfortableDisplay" />
                    </IonSelectOption>
                  </Select>
                }
              />
              <Row
                name={translate({ text: "language" })}
                value={
                  <Select
                    aria-label={translate({ text: "language" })}
                    value={language}
                    onIonChange={(event) => {
                      setLanguage(event.detail.value);
                      props.recieveLanguage(event.detail.value);
                    }}
                    interface="action-sheet"
                    cancelText={translate({ text: "cancel" })}
                  >
                    {releasedLocales.map(({ code, name }) => (
                      <IonSelectOption key={code} value={code}>
                        {name}
                      </IonSelectOption>
                    ))}
                  </Select>
                }
              />
            </React.Fragment>
          )}
        </Translator>
      </GroupCard>
    </Section>
  );
};

const Select = styled(IonSelect)`
  --padding-bottom: 0;
  --padding-top: 0;
  --placeholder-color: var(--app-text-muted);
  min-width: 128px;
  color: var(--app-text-primary);
  opacity: 0.9 !important;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: bold;
  justify-content: flex-end;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    language: languageSelector(state),
    theme: themeSelector(state),
    displayMode: displayModeSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveLanguage, setTheme, setDisplayMode }, dispatch),
  };
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);

export { Settings };
