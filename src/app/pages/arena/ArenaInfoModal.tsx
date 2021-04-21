import { closeOutline, search, shuffle, trashBin } from "ionicons/icons";
import React, { useRef } from "react";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { useInterval } from "@/app/hooks";
import { CreateAnimation, IonContent, IonIcon, IonModal } from "@ionic/react";

import { ArenaWatermark } from "./ArenaWatermark";

type Props = {
    isOpen: boolean;
    onDidDismiss: () => void;
};

const ArenaInfoModal: React.FC<Props> = (props) => {
    return (
        <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
            <ArenaWatermark />
            <CloseIcon icon={closeOutline} onClick={() => props.onDidDismiss()} />
            <Content>
                <Container>
                    <SubHeader>Welcome to the</SubHeader>
                    <Header>Test</Header>
                    <ParagraphCenter>
                        The Test is a <b>test</b> that is <b>set up</b> and <b> marked</b> in the{" "}
                        <b>same way</b> as the <b>real learners license test</b>
                    </ParagraphCenter>

                    <HorizontalRule
                        leftMargin={10}
                        rightMargin={10}
                        paddingTop={20}
                        paddingBottom={20}
                    />
                    <Center>
                        <ShuffleIcon />
                    </Center>
                    <ParagraphCenter>
                        <b>Test</b> questions are <b>randomly</b> selected from a bank of over{" "}
                        <b>400 questions</b>
                    </ParagraphCenter>

                    <HorizontalRule
                        leftMargin={10}
                        rightMargin={10}
                        paddingTop={20}
                        paddingBottom={20}
                    />
                    <Center>
                        <SearchIcon />
                    </Center>
                    <ParagraphCenter>
                        We apply a <b>weighting</b> when selecting your test questions. This means
                        you more likely to see{" "}
                        <i>
                            <b>new</b>
                        </i>{" "}
                        questions or ones you <b>previously</b> answered <b>incorrectly</b>
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
                        Your <b>Test</b> history can be <b>reset</b> in the <b>Profile</b> tab
                    </ParagraphCenter>
                </Container>
            </Content>
        </Modal>
    );
};

const ShuffleIcon: React.FC = () => {
    const animation1 = useRef<CreateAnimation>(null);

    useInterval(() => {
        if (animation1.current) animation1.current.animation.play();
    }, 6000);

    return (
        <CreateAnimation
            play={false}
            ref={animation1}
            duration={700}
            easing="ease"
            keyframes={[
                { offset: 0, transform: "rotateX(0)" },
                { offset: 0.5, transform: "rotateX(190deg)" },
                { offset: 1, transform: "rotateX(360deg)" },
            ]}
        >
            <div>
                <LargeIcon
                    icon={shuffle}
                    style={{
                        opacity: 0.8,
                    }}
                />
            </div>
        </CreateAnimation>
    );
};

const SearchIcon: React.FC = () => {
    const animation1 = useRef<CreateAnimation>(null);

    useInterval(
        () => {
            if (animation1.current) animation1.current.animation.play();
        },
        6000,
        2000
    );

    return (
        <CreateAnimation
            play={false}
            ref={animation1}
            duration={700}
            easing="ease"
            keyframes={[
                { offset: 0, transform: "scale(1)" },
                { offset: 0.5, transform: "scale(0.85)" },
                { offset: 1, transform: "scale(1)" },
            ]}
        >
            <div>
                <LargeIcon
                    icon={search}
                    style={{
                        opacity: 0.8,
                    }}
                />
            </div>
        </CreateAnimation>
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
                    icon={trashBin}
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

const Content = styled(IonContent)`
    --background: transparent;
`;

const Modal = styled(IonModal)`
    color: var(--ion-color-light);
    --background: var(--arena-background);
`;

export { ArenaInfoModal };
