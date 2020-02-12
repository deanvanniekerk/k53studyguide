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
    delay = 0
) => {
    if (!ref || !ref.current) return;

    setTimeout(() => {
        if (!ref || !ref.current) return;

        const animate = ref.current[animation];

        if (!animate) return;

        animate(duration);
    }, delay);
};
