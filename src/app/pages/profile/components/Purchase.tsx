import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import { purchaseSelector } from "@/state/purchase";
import { IonCol, IonGrid, IonRow } from "@ionic/react";

type Props = PropsFromState;

const PurchaseComponent: React.FC<Props> = props => {
    return (
        <Grid>
            <Row>
                <Col>{JSON.stringify(props.purchase)}</Col>
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
    };
};

const Purchase = connect(mapStateToProps)(PurchaseComponent);

export { Purchase };
