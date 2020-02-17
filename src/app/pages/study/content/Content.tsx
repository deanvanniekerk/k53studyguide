import React from "react";
import { Translate, Translator } from "react-translated";
import { HorizontalRule } from "src/app/components";
import { ContentItem } from "src/data";

//import { ContentImage } from "./ContentImage";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

type Props = {
    item: ContentItem;
    navigationKey: string;
};

type Translator = (translate: Translate) => React.ReactNode;

type Translate = {
    translate: (data: TranslationData) => string;
};

type TranslationData = {
    text: string;
};

const Content: React.FC<Props> = ({ item, navigationKey }) => {
    const translator: Translator = ({ translate }) => {
        console.log("translate", translate);

        const text = translate({
            text: item.description,
        });

        return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
    };

    return (
        <IonGrid style={{ paddingBottom: 15 }}>
            <IonRow style={{ paddingBottom: 8 }}>
                <IonCol>
                    <IonText style={{ fontWeight: "bold", fontSize: 15 }}>
                        <Translate text={item.heading} />
                    </IonText>
                </IonCol>
                <IonCol style={{ flex: 0 }}>
                    x{/* <ContentSeenIndicator navigationKey={navigationKey} /> */}
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonText style={{ fontSize: 14, lineHeight: 1.5 }}>
                        <Translator>{translator}</Translator>
                    </IonText>
                </IonCol>
            </IonRow>
            {/* <ContentImage imageName={item.imageName} /> */}
            <IonRow>
                <IonCol>
                    <HorizontalRule
                        leftMargin={20}
                        rightMargin={36}
                        paddingBottom={8}
                        paddingTop={12}
                    />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export { Content };
