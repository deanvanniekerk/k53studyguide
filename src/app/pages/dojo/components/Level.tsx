import { flashOutline } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { ProgressBar, StarRating } from "@/app/components";
import { RootState } from "@/state";
import {
    dojoCurrentExperiencePercentSelector,
    dojoLevelSelector,
    requiredLevelUpExperiencePointsSelector,
} from "@/state/dojo/log";
import { IonIcon } from "@ionic/react";

import { LevelText } from "./";

type Props = PropsFromState;

const LevelComponent: React.FC<Props> = (props) => {
    return (
        <Wrapper>
            <LevelText level={props.level} />

            <StarWrapper>
                <StarRating total={5} current={props.level} size="2.6rem" padding="6px" />
            </StarWrapper>
            <LevelUpText>
                <Translate
                    text="dojoLevelUpAfter"
                    data={{ number: props.requiredLevelUpExperiencePoints }}
                />
            </LevelUpText>
            <ProgressBarWrapper>
                <ProgressBarColumn>
                    <ProgressBar
                        progress={props.dojoCurrentExperiencePercent}
                        backgroundOpacity={0.1}
                        foregroundOpacity={0.4}
                        height={5}
                    ></ProgressBar>
                </ProgressBarColumn>
                <div>
                    <ExperienceIcon icon={flashOutline} />
                </div>
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

const StarWrapper = styled.div`
    padding-top: 5px;
    display: flex;
    justify-content: center;
`;

const LevelUpText = styled.div`
    text-align: center;
    font-size: var(--ion-font-size-sm);
    font-weight: 100;
    padding: 10px 0 8px 0;
`;

const ProgressBarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
`;

const ProgressBarColumn = styled.div`
    flex: 1;
`;

const ExperienceIcon = styled(IonIcon)`
    font-size: var(--ion-font-size-xs);
    margin-left: 5px;
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
