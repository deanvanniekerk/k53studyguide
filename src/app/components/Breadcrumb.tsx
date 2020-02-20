import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import { recieveCurrentNavigationKey, ROOT_NAVIGATION_KEY } from "src/state/study/navigation";
import { navigationKeyToBreadcrumb } from "src/utils";

import { IonText } from "@ionic/react";

type Props = {
    navigationKey: string;
    disableNavigation?: boolean;
} & PropsFromDispatch;

const BreadcrumbComponent: React.FC<Props> = props => {
    const breadcrumb = navigationKeyToBreadcrumb(props.navigationKey);

    return (
        <div
            style={{
                flexDirection: "row",
            }}
        >
            {breadcrumb.map((key, index) => {
                const isLast = index === breadcrumb.length - 1;

                if (isLast) return <React.Fragment key={key} />;

                return (
                    <IonText
                        key={key}
                        style={{
                            opacity: 0.6,
                        }}
                        className="text-sm"
                        onClick={() => props.recieveCurrentNavigationKey(key)}
                    >
                        {key !== ROOT_NAVIGATION_KEY ? (
                            <Translate text={key} />
                        ) : (
                            <Translate text="study" />
                        )}
                        {" / "}
                    </IonText>
                );
            })}
        </div>
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

const Breadcrumb = connect(null, mapDispatchToProps)(BreadcrumbComponent);

export { Breadcrumb };
