import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";

import { PagodaOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";
import { RootState } from "@/state";
import { IonContent, IonPage } from "@ionic/react";

type Props = PropsFromState & PropsFromDispatch;

const WelcomePage: React.FC<Props> = props => {
    // const history = useHistory();

    // const onNavigationItemClicked = (key: string) => {
    //     props.recieveCurrentNavigationKey(key);
    //     history.push(`/content`);
    // };

    return (
        <Page>
            <Watermark />
            <Content>WELCOME!</Content>
        </Page>
    );
};

const Watermark = styled(PagodaOutlineIcon)`
    ${watermarkStyle}
`;

const Content = styled(IonContent)`
    --background: transparent;
`;

const Page = styled(IonPage)`
    background: var(--study-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {};
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
