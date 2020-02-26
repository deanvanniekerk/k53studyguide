import { chevronForwardOutline } from "ionicons/icons";
import React from "react";
import { Translate } from "react-translated";

import { TEXT_COLOR } from "@/data";
import { CreateAnimation, IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";

type Props = {
    navigationItemKey: string;
    onClick: (navigationItemKey: string) => void;
    index: number;
    indicator?: React.ReactNode;
};

const NavigationItem: React.FC<Props> = props => {
    const delay = props.index * 40;
    return (
        <IonItem onClick={() => props.onClick(props.navigationItemKey)}>
            <IonIcon
                icon={chevronForwardOutline}
                className="text-l"
                style={{ marginRight: 15, color: TEXT_COLOR }}
            />
            <IonLabel>
                <CreateAnimation
                    play={true}
                    delay={delay}
                    duration={500}
                    easing="ease"
                    fromTo={{
                        property: "transform",
                        fromValue: "translateY(30px)",
                        toValue: "translateY(0px)",
                    }}
                >
                    <div>
                        <IonText className="text-md">
                            <Translate text={props.navigationItemKey} />
                        </IonText>
                    </div>
                </CreateAnimation>
                <CreateAnimation
                    play={true}
                    duration={400}
                    easing="ease"
                    delay={300 + delay}
                    fromTo={{
                        property: "transform",
                        fromValue: "translateX(-80px)",
                        toValue: "translateX(0px)",
                    }}
                >
                    {props.indicator && (
                        <div style={{ paddingTop: 6, width: 60 }}>{props.indicator}</div>
                    )}
                </CreateAnimation>
            </IonLabel>
        </IonItem>
    );
};

export { NavigationItem };
