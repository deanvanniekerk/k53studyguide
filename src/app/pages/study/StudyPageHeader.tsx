import { informationCircleOutline } from "ionicons/icons";
import React from "react";
import styled from "styled-components";

import { PageHeader } from "@/app/components";
import { IonIcon } from "@ionic/react";

type Props = {
    onInfoClicked: () => void;
};

const StudyPageHeader: React.FC<Props> = props => {
    return (
        <PageHeader
            text="study"
            rightComponent={
                <IconWrapper onClick={props.onInfoClicked}>
                    <InfoIcon icon={informationCircleOutline} />
                </IconWrapper>
            }
        />
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
`;

export { StudyPageHeader };
