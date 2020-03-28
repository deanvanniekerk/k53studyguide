import { useEffect, useRef } from "react";

type Callback = () => void;

const useInterval = (callback: Callback, delay: number, initialDelay = 0) => {
    const savedCallback = useRef<Callback>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        setTimeout(() => {
            const tick = () => {
                if (savedCallback.current) savedCallback.current();
            };
            if (delay !== null) {
                const id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, initialDelay);
    }, [delay]);
};

export { useInterval };
