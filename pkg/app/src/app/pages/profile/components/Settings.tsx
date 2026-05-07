import { IonSelect, IonSelectOption } from "@ionic/react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import { languageSelector, recieveLanguage, setTheme, type Theme, themeSelector } from "@/state/settings";
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
                name={translate({ text: "language" })}
                value={
                  <Select
                    value={language}
                    onIonChange={(event) => {
                      setLanguage(event.detail.value);
                      props.recieveLanguage(event.detail.value);
                    }}
                    interface="action-sheet"
                    cancelText={translate({ text: "cancel" })}
                  >
                    <IonSelectOption value="en">English</IonSelectOption>
                    <IonSelectOption value="af">Afrikaans</IonSelectOption>
                    <IonSelectOption value="zu">Zulu</IonSelectOption>
                    <IonSelectOption value="xh">Xhosa</IonSelectOption>
                  </Select>
                }
              />
              <Row
                name="Appearance"
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
                    <IonSelectOption value="system">System default</IonSelectOption>
                    <IonSelectOption value="light">Light</IonSelectOption>
                    <IonSelectOption value="dark">Dark</IonSelectOption>
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
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveLanguage, setTheme }, dispatch),
  };
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);

export { Settings };
