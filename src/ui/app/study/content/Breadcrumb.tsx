import * as React from "react";
import { TextStyle, View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { currentNavigationBreadcrumbSelector } from "@/state/study/navigation";
import { translationsSelector } from "@/state/translations/selectors";
import { Text } from "@/ui/components";

type Props = PropsFromState;

const BreadcrumbComponent: React.FC<Props> = props => {
    return (
        <View
            style={{
                flexDirection: "row",
                paddingTop: 15,
            }}
        >
            {props.breadcrumb.map((b, i) => {
                const isLast = i === props.breadcrumb.length - 1;

                if (isLast) return;

                const style: TextStyle = {
                    opacity: 0.6,
                    fontSize: 12,
                };

                return (
                    <Text key={b} style={style}>
                        {props.translations[b] ? props.translations[b] : "Home"}
                        {isLast ? "" : " / "}
                    </Text>
                );
            })}
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        breadcrumb: currentNavigationBreadcrumbSelector(state),
        translations: translationsSelector(state),
    };
};

const Breadcrumb = connect(mapStateToProps)(BreadcrumbComponent);

export { Breadcrumb };
