import React, { useContext } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { PurchaseContext } from "@/context";
import { RootState } from "@/state";
import { canPurchaseSelector, hasFullAccessSelector, purchaseSelector } from "@/state/purchase";
import { IonButton, IonCol, IonGrid, IonRow, IonText, useIonViewWillEnter } from "@ionic/react";

import { Row } from "./";

type Props = PropsFromState;

const PurchaseComponent: React.FC<Props> = props => {
    const purchaseService = useContext(PurchaseContext);

    useIonViewWillEnter(() => {
        if (!props.hasFullAccess && purchaseService) purchaseService.loadPurchase();
    });

    return (
        <Grid>
            <FullRow>
                <TitleCol>
                    <Title>Purchase</Title>
                </TitleCol>
            </FullRow>
            <FullRow>
                <Col>
                    {props.canPurchase && !!purchaseService && (
                        <IonButton
                            color="tertiary"
                            shape="round"
                            fill="solid"
                            onClick={() => purchaseService.purchase()}
                        >
                            Purchase
                        </IonButton>
                    )}
                </Col>
            </FullRow>
            {props.purchase.owned && (
                <React.Fragment>
                    <Row name="Full Access Purchased" value={props.purchase.owned ? "Yes" : "No"} />
                    <Row name="Purchase Date" value={props.purchase.purchaseDate || ""} />
                </React.Fragment>
            )}
            <FullRow>
                <IonCol>{LineBreak}</IonCol>
            </FullRow>
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
