import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from "@chakra-ui/theme-tools"

const theme = extendTheme({
    fonts: {
        heading: `'Open Sans', sans-serif`,
        body: `'League Spartan', sans-serif`,
    },
    breakpoints: createBreakpoints({
        sm: "320px",
        md: "768px",
        lg: "960px",
        xl: "1200px",
    }),
    styles: {
        global: {
            body: {
                transitionProperty: "all",
                transitionDuration: "normal",
            },
        },
    },
    config: {
        disableTransitionOnChange: false
    }
});

export default theme;