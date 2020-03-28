import { informationCircleOutline } from "ionicons/icons";
import React from "react";
import styled from "styled-components";

import { IonIcon } from "@ionic/react";

type Props = {
    onClick: () => void;
};

const PageHeaderInfoIcon: React.FC<Props> = props => {
    return (
        <IconWrapper onClick={props.onClick}>
            <InfoIcon icon={informationCircleOutline} />
        </IconWrapper>
    );
};

const IconWrapper = styled.div`
    position: relative;
`;

const InfoIcon = styled(IonIcon)`
    left: -16px;
    top: -3px;
    position: absolute;
    font-size: var(--ion-font-size-xl);
    opacity: 0.7;
`;

export { PageHeaderInfoIcon };
