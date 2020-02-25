import { star, starOutline } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { ProgressBar } from "@/app/components";
import { RootState } from "@/state";
import {
    dojoCurrentExperiencePercentSelector,
    dojoLevelSelector,
    requiredLevelUpExperiencePointsSelector,
} from "@/state/dojo/log";
import { IonIcon } from "@ionic/react";

type Props = PropsFromState;

const LevelComponent: React.FC<Props> = props => {
    return (
        <Wrapper>
            <LevelText>
                <Translate text="level" /> {props.level}
            </LevelText>
            <div>
                <StarWrapper>
                    <Star>
                        <IonIcon icon={props.level === 1 ? star : starOutline} />
                    </Star>
                    <Star>
                        <IonIcon icon={props.level === 2 ? star : starOutline} />
                    </Star>
                    <Star>
                        <IonIcon icon={props.level === 3 ? star : starOutline} />
                    </Star>
                    <Star>
                        <IonIcon icon={props.level === 4 ? star : starOutline} />
                    </Star>
                    <Star>
                        <IonIcon icon={props.level === 5 ? star : starOutline} />
                    </Star>
                </StarWrapper>
            </div>
            <LevelUpText>
                <Translate
                    text="dojoLevelUpAfter"
                    data={{ number: props.requiredLevelUpExperiencePoints }}
                />
            </LevelUpText>
            <ProgressBarWrapper>
                <ProgressBar
                    progress={props.dojoCurrentExperiencePercent}
                    backgroundOpacity={0.1}
                    foregroundOpacity={0.4}
                ></ProgressBar>
            </ProgressBarWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 0 15px;
    border-radius: var(--ic-corner-radius);
    border: var(--ic-border);
    padding: var(--ic-padding);
`;

const LevelText = styled.div`
    text-align: center;
    font-weight: bold;
    padding: 8px 0 10px 0;
`;

const StarWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const Star = styled.div`
    font-size: 2rem;
    padding: 0 5px;
`;

const LevelUpText = styled.div`
    text-align: center;
    font-size: var(--ion-font-size-sm);
    font-weight: 100;
    padding: 10px 0 8px 0;
`;

const ProgressBarWrapper = styled.div`
    padding: 5px 15px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        level: dojoLevelSelector(state),
        requiredLevelUpExperiencePoints: requiredLevelUpExperiencePointsSelector(state),
        dojoCurrentExperiencePercent: dojoCurrentExperiencePercentSelector(state),
    };
};

const Level = connect(mapStateToProps)(LevelComponent);

export { Level };
