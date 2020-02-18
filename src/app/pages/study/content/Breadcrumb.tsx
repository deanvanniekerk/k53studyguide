import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/state";
import {
    currentNavigationBreadcrumbSelector,
    recieveCurrentNavigationKey,
    ROOT_NAVIGATION_KEY,
} from "src/state/study/navigation";

import { IonText } from "@ionic/react";

type Props = PropsFromState & PropsFromDispatch;

const BreadcrumbComponent: React.FC<Props> = props => {
    return (
        <div
            style={{
                flexDirection: "row",
            }}
        >
            {props.breadcrumb.map((key, index) => {
                const isLast = index === props.breadcrumb.length - 1;

                if (isLast) return <React.Fragment key={key} />;

                return (
                    <IonText
                        key={key}
                        style={{
                            opacity: 0.6,
                            fontSize: 12,
                        }}
                        onClick={() => props.recieveCurrentNavigationKey(key)}
                    >
                        {key !== ROOT_NAVIGATION_KEY ? <Translate text={key} /> : "Study"}
                        {" / "}
                    </IonText>
                );
            })}
        </div>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        breadcrumb: currentNavigationBreadcrumbSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

const Breadcrumb = connect(mapStateToProps, mapDispatchToProps)(BreadcrumbComponent);

export { Breadcrumb };
