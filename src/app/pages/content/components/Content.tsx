import "./Content.css";

import React from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import VisibilitySensor from "react-visibility-sensor";
import { bindActionCreators, Dispatch } from "redux";
import { HorizontalRule } from "src/app/components";
import { ContentItem } from "src/data";
import { recieveSeenContentKey } from "src/state/study/log";

import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

import { ContentSeenIndicator } from "./ContentSeenIndicator";

type Props = {
    item: ContentItem;
    navigationKey: string;
} & PropsFromDispatch;

type Translator = (translate: Translate) => React.ReactNode;

type Translate = {
    translate: (data: TranslationData) => string;
};

type TranslationData = {
    text: string;
};

const ContentComponent: React.FC<Props> = ({ item, navigationKey, recieveSeenContentKey }) => {
    const translator: Translator = ({ translate }) => {
        const text = translate({ text: item.description });
        return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
    };

    const visibilityChange = (visible: boolean) => {
        if (visible) recieveSeenContentKey(navigationKey);
    };

    return (
        <IonGrid style={{ paddingBottom: 15 }} className="study-content">
            <IonRow style={{ paddingBottom: 8 }}>
                <IonCol>
                    <IonText style={{ fontWeight: "bold", fontSize: 15 }}>
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
                        <img src={`assets/images/${item.imageName}`} alt="" />
                    </IonCol>
                </IonRow>
            )}
            <IonRow>
                <IonCol className="content-html">
                    <IonText style={{ fontSize: 14, lineHeight: 1.5 }}>
                        <Translator>{translator}</Translator>
                    </IonText>
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

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveSeenContentKey }, dispatch),
    };
};

const Content = connect(null, mapDispatchToProps)(ContentComponent);

export { Content };
