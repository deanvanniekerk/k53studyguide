import { flash, flashOffOutline } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { NinjaHappyIcon, NinjaSadIcon } from "@/app/components/icons";
import { RootState } from "@/state";
import {
    experienceGainedSelector,
    totalCorrectAnswersSelector,
    totalQuestionsSelector,
} from "@/state/dojo/test";
import { CreateAnimation, IonIcon } from "@ionic/react";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    const allCorrect = props.totalCorrectAnswers === props.totalQuestions;

    if (props.totalQuestions === 0) return <React.Fragment />;

    return (
        <React.Fragment>
            <Result>
                <NinjaIcon allCorrect={allCorrect} />
                <div style={{ overflow: "hidden" }}>
                    <ResultText
                        totalCorrectAnswers={props.totalCorrectAnswers}
                        totalQuestions={props.totalQuestions}
                    />
                </div>
            </Result>
            <ExperienceGained>
                <ExperienceIcon icon={props.experienceGained === 0 ? flashOffOutline : flash} />
                <Translate
                    text="numberExperienceGained"
                    data={{ number: props.experienceGained.toString() }}
                />
            </ExperienceGained>
            <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={30} paddingTop={25} />
        </React.Fragment>
    );
};

type NinjaIconProps = {
    allCorrect: boolean;
};

const NinjaIcon: React.FC<NinjaIconProps> = props => {
    return (
        <CreateAnimation
            play={true}
            duration={700}
            easing="ease"
            delay={600}
            keyframes={[
                { offset: 0, transform: "scale(1)" },
                { offset: 0.5, transform: "scale(1.3)" },
                { offset: 1, transform: "scale(1)" },
            ]}
        >
            <div>
                {props.allCorrect && <NinjaHappyIcon style={{ fontSize: "3.7rem" }} />}
                {!props.allCorrect && <NinjaSadIcon style={{ fontSize: "3.7rem" }} />}
            </div>
        </CreateAnimation>
    );
};

type ResultTextProps = {
    totalCorrectAnswers: number;
    totalQuestions: number;
};

const ResultText: React.FC<ResultTextProps> = props => {
    return (
        <CreateAnimation
            play={true}
            duration={700}
            easing="ease"
            delay={200}
            fromTo={{
                property: "transform",
                fromValue: "translateY(80px)",
                toValue: "translateY(0px)",
            }}
        >
            <h2>
                <Translate text="result" />: {props.totalCorrectAnswers} / {props.totalQuestions}
            </h2>
        </CreateAnimation>
    );
};

const Result = styled.div`
    padding-top: 55px;
    font-size: var(--ion-font-size-l);
    text-align: center;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const ExperienceGained = styled.div`
    padding-top: 12px;
    text-align: center;
`;

const ExperienceIcon = styled(IonIcon)`
    margin-right: 7px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        totalQuestions: totalQuestionsSelector(state),
        totalCorrectAnswers: totalCorrectAnswersSelector(state),
        experienceGained: experienceGainedSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
