import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import { languageSelector, recieveLanguage } from "@/state/settings";
import { IonCol, IonGrid, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";

type Props = PropsFromState & PropsFromDispatch;

const SettingsComponent: React.FC<Props> = (props) => {
    //Mini hack to get around to resetting issue....
    const [language, setLanguage] = useState(props.language);

    return (
        <Grid>
            <Row>
                <SettingTitleCol>
                    <SettingTitle>
                        <Translate text="settings" />
                    </SettingTitle>
                </SettingTitleCol>
            </Row>
            <Row>
                <SettingNameCol>
                    <SettingName>
                        <Translate text="language" />
                    </SettingName>
                </SettingNameCol>
                <SettingValueCol>
                    <Translator>
                        {({ translate }) => (
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
                        )}
                    </Translator>
                </SettingValueCol>
            </Row>
            <Row>
                <IonCol>{LineBreak}</IonCol>
            </Row>
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 55px;
`;

const Row = styled(IonRow)`
    padding: 7px 0;
    align-items: center;
`;

const SettingTitle = styled(IonText)`
    opacity: 0.5;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-transform: uppercase;
`;

const SettingTitleCol = styled(IonCol)`
    padding-bottom: 5px;
`;

const SettingName = styled(IonText)`
    font-size: var(--ion-font-size-md);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const SettingNameCol = styled(IonCol)`
    flex: 0;
    white-space: nowrap;
    padding-right: 15px;
`;

const SettingValueCol = styled(IonCol)`
    color: var(--ion-color-dark);
    opacity: 0.9 !important;
    font-family: var(--ion-font-family-bold);
    font-size: var(--ion-font-size-md);
    font-weight: bold;
    text-align: end;
    line-height: 1.2rem;
`;

const Select = styled(IonSelect)`
    --padding-bottom: 0;
    --padding-top: 0;
    color: var(--ion-color-light);
    opacity: 0.9 !important;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        language: languageSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveLanguage }, dispatch),
    };
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);

export { Settings };
