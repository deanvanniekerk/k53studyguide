import { informationCircleOutline } from "ionicons/icons";
import React from "react";
import styled from "styled-components";

import { IonIcon } from "@ionic/react";

type Props = {
    onClick: () => void;
};

const PageHeaderInfoIcon: React.FC<Props> = (props) => {
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
    left: -30px;
    top: -2px;
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
`;

export { PageHeaderInfoIcon };
