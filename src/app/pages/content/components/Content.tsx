import "./Content.css";

import React from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import VisibilitySensor from "react-visibility-sensor";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { ContentItem } from "@/data";
import { recieveSeenContentKey } from "@/state/study/log";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

import { ContentSeenIndicator } from "./ContentSeenIndicator";

type Props = {
    item: ContentItem;
    navigationKey: string;
} & PropsFromDispatch;

const ContentComponent: React.FC<Props> = ({ item, navigationKey, recieveSeenContentKey }) => {
    const visibilityChange = (visible: boolean) => {
        if (visible) recieveSeenContentKey(navigationKey);
    };

    return (
        <IonGrid style={{ paddingBottom: 15 }} className="study-content">
            <IonRow style={{ paddingBottom: 8 }}>
                <IonCol>
                    <IonText className="text-md" style={{ fontWeight: "bold" }}>
                        <Translate text={item.heading} />
                    </IonText>
                </IonCol>
                <IonCol style={{ flex: 0 }}>
                    <ContentSeenIndicator navigationKey={navigationKey} />
                </IonCol>
            </IonRow>
            {item.imageName && (
                <IonRow>
                    <IonCol style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>
                        <img
                            src={`assets/images/${item.imageName}`}
                            alt=""
                            style={{ maxWidth: "100%" }}
                        />
                    </IonCol>
                </IonRow>
            )}
            <IonRow>
                <IonCol className="content-html">
                    <Description>
                        <Translator>
                            {({ translate }) => (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: translate({ text: item.description }),
                                    }}
                                ></div>
                            )}
                        </Translator>
                    </Description>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <VisibilitySensor
                        partialVisibility={true}
                        onChange={visibilityChange}
                        delayedCall={true}
                    >
                        <HorizontalRule
                            leftMargin={20}
                            rightMargin={36}
                            paddingBottom={12}
                            paddingTop={18}
                        />
                    </VisibilitySensor>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

const Description = styled(IonText)`
    font-size: var(--ion-font-size-md);
    line-height: var(--line-height);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveSeenContentKey }, dispatch),
    };
};

const Content = connect(null, mapDispatchToProps)(ContentComponent);

export { Content };
