import { checkmarkCircleOutline } from "ionicons/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import styled from "styled-components";

import { RootState } from "@/state";
import { allQuestionsAnsweredSelector } from "@/state/dojo/test";
import { IonButton, IonIcon, IonToast } from "@ionic/react";

type Props = {
    onSubmitClicked: () => void;
} & PropsFromState;

const FooterComponent: React.FC<Props> = (props) => {
    const [showNotComplete, setShowNotComplete] = useState(false);

    const onSubmitClicked = () => {
        if (!props.allQuestionsAnswered) {
            setShowNotComplete(true);
            return;
        }

        props.onSubmitClicked();
    };

    return (
        <Wrapper>
            <IonButton
                color="secondary"
                shape="round"
                fill="solid"
                className="button-med-large"
                onClick={onSubmitClicked}
            >
                <Translate text="submit" />
                <IonIcon slot="end" icon={checkmarkCircleOutline} />
            </IonButton>

            <Translator>
                {({ translate }) => (
                    <IonToast
                        isOpen={showNotComplete}
                        message={translate({ text: "pleaseAnswerAllQuestions" })}
                        onDidDismiss={() => setShowNotComplete(false)}
                        duration={3000}
                        position="top"
                        color="light"
                    />
                )}
            </Translator>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    text-align: center;
    padding-bottom: 35px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        allQuestionsAnswered: allQuestionsAnsweredSelector(state),
    };
};

const Footer = connect(mapStateToProps)(FooterComponent);

export { Footer };
