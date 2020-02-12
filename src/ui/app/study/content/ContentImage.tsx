import React from "react";
import { Dimensions, Image, View } from "react-native";

import { images } from "@/data/images/images";
import { PAGE_MARGIN } from "@/data/theme";

type Props = {
    imageName?: string;
};

const ContentImage: React.FC<Props> = props => {
    if (!props.imageName) return <React.Fragment />;

    const imageData = images[props.imageName];

    if (!imageData) return <React.Fragment />;

    const screenWidth = Dimensions.get("screen").width - PAGE_MARGIN * 2;

    let { width, height } = imageData;

    if (imageData.width > screenWidth) {
        width = screenWidth;
        //new height = new width * original height / original width
        height = screenWidth * (height / width);
    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
            <Image
                source={imageData.source}
                style={{
                    width: width,
                    height: height,
                }}
                resizeMode="contain"
            />
        </View>
    );
};

export { ContentImage };
