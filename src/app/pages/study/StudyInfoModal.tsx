import { closeOutline, eyeOffOutline, eyeOutline, trashBinOutline } from "ionicons/icons";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { HorizontalRule, ProgressBar } from "@/app/components";
import { BookOutlineIcon } from "@/app/components/icons";
import { useInterval } from "@/app/hooks";
import { watermarkStyle } from "@/app/styles";
import { CreateAnimation, IonContent, IonIcon, IonModal } from "@ionic/react";

type Props = {
    isOpen: boolean;
    onDidDismiss: () => void;
};

const StudyInfoModal: React.FC<Props> = (props) => {
    return (
        <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
            <Watermark />
            <CloseIcon icon={closeOutline} onClick={() => props.onDidDismiss()} />
            <Content>
                <Container>
                    <SubHeader>Welcome to the</SubHeader>
                    <Header>Study Section</Header>
                    <ParagraphCenter>
                        The study section contains all the K53 material you need to study in order
                        to pass your leaners license test
                    </ParagraphCenter>

                    <HorizontalRule
                        leftMargin={10}
                        rightMargin={10}
                        paddingTop={20}
                        paddingBottom={20}
                    />
                    <Center>
                        <SeenIcon />
                    </Center>
                    <ParagraphCenter>
                        All sections that have been <b>read</b> through are tracked, this is
                        indicated by the <b>seen</b> icon
                    </ParagraphCenter>

                    <HorizontalRule
                        leftMargin={10}
                        rightMargin={10}
                        paddingTop={20}
                        paddingBottom={20}
                    />
                    <Center>
                        <ProgressBarIndicator />
                    </Center>
                    <ParagraphCenter>
                        Progress bars indictate <b>cumulative</b> totals of sections that have been
                        read through
                    </ParagraphCenter>

                    <HorizontalRule
                        leftMargin={10}
                        rightMargin={10}
                        paddingTop={20}
                        paddingBottom={35}
                    />
                    <Center>
                        <TrashIcon />
                    </Center>
                    <ParagraphCenter>
                        Your <b>read</b> history can be <b>reset</b> in the <b>Profile</b> tab
                    </ParagraphCenter>
                </Container>
            </Content>
        </Modal>
    );
};

const SeenIcon: React.FC = () => {
    const [icon, setIcon] = useState("eyeOff");
    const animation1 = useRef<CreateAnimation>(null);

    useInterval(() => {
        setIcon(icon === "eye" ? "eyeOff" : "eye");
        if (animation1.current) animation1.current.animation.play();
    }, 6000);

    return (
        <CreateAnimation
            play={false}
            ref={animation1}
            duration={700}
            easing="ease"
            keyframes={[
                { offset: 0, transform: "scale(1)" },
                { offset: 0.5, transform: "scale(1.05)" },
                { offset: 1, transform: "scale(1)" },
            ]}
        >
            <div>
                <LargeIcon
                    icon={icon === "eye" ? eyeOutline : eyeOffOutline}
                    style={{
                        opacity: icon === "eye" ? 0.8 : 0.5,
                    }}
                />
            </div>
        </CreateAnimation>
    );
};

const ProgressBarIndicator: React.FC = () => {
    const [percent, setPercent] = useState(25);

    useInterval(
        () => {
            let next = percent + 25;
            if (next > 100) next = 25;
            setPercent(next);
        },
        6000,
        2000
    );

    return (
        <ProgressBarWrapper>
            <ProgressBar progress={percent} height={8} />
        </ProgressBarWrapper>
    );
};

const TrashIcon: React.FC = () => {
    const animation1 = useRef<CreateAnimation>(null);

    useInterval(
        () => {
            if (animation1.current) animation1.current.animation.play();
        },
        6000,
        4000
    );

    return (
        <CreateAnimation
            play={false}
            ref={animation1}
            duration={300}
            easing="ease"
            keyframes={[
                { offset: 0, transform: "rotate(0deg)" },
                { offset: 0.2, transform: "rotate(5deg)" },
                { offset: 0.4, transform: "rotate(-5deg)" },
                { offset: 0.6, transform: "rotate(5deg)" },
                { offset: 0.8, transform: "rotate(-5deg)" },
                { offset: 1, transform: "rotate(0deg)" },
            ]}
        >
            <div>
                <LargeIcon
                    icon={trashBinOutline}
                    style={{
                        opacity: 0.8,
                    }}
                />
            </div>
        </CreateAnimation>
    );
};

const Container = styled.div`
    padding: 0 var(--default-padding);
    padding-bottom: 50px;
`;

const Watermark = styled(BookOutlineIcon)`
    ${watermarkStyle}
`;

const CloseIcon = styled(IonIcon)`
    position: absolute;
    z-index: 102;
    font-size: var(--ion-font-size-xxxl);
    padding-left: var(--default-padding);
    padding-top: var(--default-padding);
`;

const Header = styled.div`
    font-size: var(--ion-font-size-xxl);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
`;

const SubHeader = styled.div`
    text-align: center;
    padding-bottom: 20px;
    padding-top: 55px;
`;

const Paragraph = styled.p`
    font-size: var(--ion-font-size-md);
`;

const ParagraphCenter = styled(Paragraph)`
    text-align: center;
`;

const Center = styled.div`
    text-align: center;
`;

const LargeIcon = styled(IonIcon)`
    font-size: 4rem;
`;

const ProgressBarWrapper = styled.div`
    padding: 22px 25px;
`;

const Content = styled(IonContent)`
    --background: transparent;
`;

const Modal = styled(IonModal)`
    color: var(--ion-color-light);
    --background: var(--study-background);
`;

export { StudyInfoModal };
