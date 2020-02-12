import React from "react";
import { TextStyle } from "react-native";

import { IconType } from "@/data";
import { FONT_SIZE, TEXT_COLOR } from "@/data/theme";
import { AntDesign, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { hexToRgb } from "../utils/color";

type Props = {
    type: IconType;
    name: string;
    size?: number;
    color?: string;
    opacity?: number;
    style?: TextStyle;
};

const Icon: React.FC<Props> = props => {
    const color = `rgba(${hexToRgb(props.color || TEXT_COLOR).join(",")}, ${props.opacity})`;

    switch (props.type) {
        case "ant-design":
            return (
                <AntDesign name={props.name} style={props.style} color={color} size={props.size} />
            );
        case "font-awesome":
            return (
                <FontAwesome
                    name={props.name}
                    style={props.style}
                    color={color}
                    size={props.size}
                />
            );
        case "feather":
            return (
                <Feather name={props.name} style={props.style} color={color} size={props.size} />
            );
        case "material":
            return (
                <MaterialIcons
                    name={props.name}
                    style={props.style}
                    color={color}
                    size={props.size}
                />
            );
        default:
            return (
                <AntDesign name="question" style={props.style} color={color} size={props.size} />
            );
    }
};
Icon.defaultProps = {
    color: TEXT_COLOR,
    size: FONT_SIZE,
    opacity: 1,
};

export { Icon };
