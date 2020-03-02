import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import {
    experienceGainedSelector,
    totalCorrectAnswersSelector,
    totalQuestionsSelector,
} from "@/state/dojo/test";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <React.Fragment>
            <Result>
                <h2>
                    <Translate text="result" />: {props.totalCorrectAnswers} /{" "}
                    {props.totalQuestions}
                </h2>
            </Result>
            <ExperienceGained>
                <Translate
                    text="numberExperienceGained"
                    data={{ number: props.experienceGained.toString() }}
                />
            </ExperienceGained>
            <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={30} paddingTop={25} />
        </React.Fragment>
    );
};

const Result = styled.div`
    padding-top: 55px;
    font-size: var(--ion-font-size-l);
    text-align: center;
`;

const ExperienceGained = styled.div`
    padding-top: 12px;
    text-align: center;
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
