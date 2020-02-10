import * as React from "react";

import { AntDesign, FontAwesome } from "@expo/vector-icons";

type IconType = "ant-design" | "font-awesome";

type Props = {
    type: IconType;
    name: string;
    size?: number;
    color?: string;
    style?: any;
};

const Icon: React.FC<Props> = props => {
    switch (props.type) {
        case "ant-design":
            return (
                <AntDesign
                    name={props.name}
                    style={props.style}
                    color={props.color}
                    size={props.size}
                />
            );
        case "font-awesome":
            return (
                <FontAwesome
                    name={props.name}
                    style={props.style}
                    color={props.color}
                    size={props.size}
                />
            );
        default:
            return (
                <AntDesign
                    name="question"
                    style={props.style}
                    color={props.color}
                    size={props.size}
                />
            );
    }
};

export { Icon };
