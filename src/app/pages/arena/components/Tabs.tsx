import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { RootState } from "@/state";
import { currentSectionSelector, recieveCurrentSection } from "@/state/arena/test";
import { IonCol, IonGrid, IonRow } from "@ionic/react";

type Props = PropsFromState & PropsFromDispatch;

const TabsComponent: React.FC<Props> = props => {
    return (
        <IonGrid>
            <IonRow style={{ paddingTop: 10, paddingBottom: 5 }}>
                <IonCol size="4" onClick={() => props.recieveCurrentSection("A")}>
                    <TabWrapper>
                        <Tab selected={props.currentSection === "A"}>Section A</Tab>
                    </TabWrapper>
                </IonCol>
                <IonCol size="4" onClick={() => props.recieveCurrentSection("B")}>
                    <TabWrapper>
                        <Tab selected={props.currentSection === "B"}>Section B</Tab>
                    </TabWrapper>
                </IonCol>
                <IonCol size="4" onClick={() => props.recieveCurrentSection("C")}>
                    <TabWrapper>
                        <Tab selected={props.currentSection === "C"}>Section C</Tab>
                    </TabWrapper>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

const TabWrapper = styled.div`
    width: 100%;
    padding: 14px;
`;

const Tab = styled.div<{ selected: boolean }>`
    text-align: center;
    font-size: var(--ion-font-size-md);
    padding-bottom: 15px;
    font-family: var(--ion-font-family-bold);
    font-weight: ${props => (props.selected ? "bold" : "normal")};
    border-bottom: ${props => (props.selected ? "2px" : "0")} solid #ffffff87;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        currentSection: currentSectionSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentSection }, dispatch),
    };
};

const Tabs = connect(mapStateToProps, mapDispatchToProps)(TabsComponent);

export { Tabs };
