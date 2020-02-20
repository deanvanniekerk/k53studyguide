import "./TestPage.css";

import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { BackButton } from "@/app/components";
import { RootState } from "@/state";
import { questionAnswersSelector } from "@/state/dojo/test/selectors";
import { IonContent, IonPage } from "@ionic/react";

type Props = PropsFromState;

const TestPage: React.FC<Props> = props => {
    const history = useHistory();

    const onBackClicked = () => {
        if (history.length === 0) history.replace("/dojo");
        else history.goBack();
    };

    return (
        <IonPage className="test-page">
            <IonContent>
                <BackButton onClick={onBackClicked} />
                {props.questionAnswers.map(qa => {
                    return <div key={qa.question.id}>{qa.question.id}</div>;
                })}
            </IonContent>
        </IonPage>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        questionAnswers: questionAnswersSelector(state),
    };
};

export default connect(mapStateToProps)(TestPage);
