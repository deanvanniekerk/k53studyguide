import * as Animatable from "react-native-animatable";

export const hidden: Animatable.CustomAnimation = {
    from: {
        opacity: 0,
    },
    to: {
        opacity: 0,
    },
};

export const animate = (
    ref: React.RefObject<Animatable.View>,
    animation: Animatable.Animation,
    duration: number,
    delay: number = 0
) => {
    if (!ref || !ref.current) return;

    setTimeout(() => {
        ref.current![animation]!(duration);
    }, delay);
};
