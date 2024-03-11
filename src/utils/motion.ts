export const bounceMotion = {
    container: {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1,
            },
        },
    },

    item: {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    },
};

export const textMotion = (
    config = {
        hidden: {left: 80},
        visible: {left: 0}
    }
) => {
    return {
        container: {
            visible: {
                transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.03,
                },
            },
        },

        item: {
            hidden: { ...config.hidden, opacity: 0 },
            visible: { ...config.visible, opacity: 1 },
        },
    }
};