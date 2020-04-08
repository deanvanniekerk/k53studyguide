import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import PurchaseModal from "@/app/modals/PurchaseModal";
import { RootState } from "@/state";
import { canPurchaseSelector, hasFullAccessSelector, purchaseSelector } from "@/state/purchase";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

import { Row } from "./";

type Props = PropsFromState;

const PurchaseComponent: React.FC<Props> = (props) => {
    const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

    return (
        <Grid>
            <FullRow>
                <TitleCol>
                    <Title>
                        <Translate text="account" />
                    </Title>
                </TitleCol>
            </FullRow>
            {!props.hasFullAccess && (
                <FullRow>
                    <Col>
                        <IonButton
                            color="tertiary"
                            shape="round"
                            fill="solid"
                            disabled={!props.canPurchase}
                            onClick={() => setPurchaseModalVisible(true)}
                        >
                            <Translate text="goPremium" />
                        </IonButton>
                    </Col>
                </FullRow>
            )}
            {props.hasFullAccess && (
                <Translator>
                    {({ translate }) => (
                        <React.Fragment>
                            <Row
                                name={translate({ text: "premiumPurchased" })}
                                value={translate({ text: "yes" })}
                            />
                        </React.Fragment>
                    )}
                </Translator>
            )}
            <FullRow>
                <IonCol>{LineBreak}</IonCol>
            </FullRow>
            <PurchaseModal
                isOpen={purchaseModalVisible}
                onDidDismiss={() => {
                    setPurchaseModalVisible(false);
                }}
            />
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 15px;
`;

const FullRow = styled(IonRow)`
    padding: 7px 0;
    align-items: center;
`;

const Title = styled(IonText)`
    opacity: 0.5;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-transform: uppercase;
`;

const TitleCol = styled(IonCol)`
    padding-bottom: 5px;
`;

const Col = styled(IonCol)`
    padding-bottom: 5px;
`;

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        purchase: purchaseSelector(state),
        hasFullAccess: hasFullAccessSelector(state),
        canPurchase: canPurchaseSelector(state),
    };
};

const Purchase = connect(mapStateToProps)(PurchaseComponent);

export { Purchase };
