export type ColorRamp = {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
}

export type HeadingScale = {
    h1: string
    h2: string
    h3: string
    h4: string
}

export type TextScale = {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
}

export type SpacingScale = {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
}

export type RadiusScale = {
    sm: string
    md: string
    lg: string
    card: string
    pill: string
    full: string
}

export type ShadowScale = {
    subtle: string
    medium: string
    strong: string
    outline: string
}

export type TransitionScale = {
    quick: string
    base: string
    slow: string
}

export type StateTokens = {
    focusRing: string
    focusShadow: string
    disabledOpacity: number
}

export type LayoutScale = {
    contentWidth: string
    sectionGap: string
}

export type MukulaTheme = {
    name: string
    colors: {
        background: string
        backgroundAlt: string
        surface: string
        surfaceMuted: string
        border: string
        borderStrong: string
        text: string
        textMuted: string
        textOnAccent: string
        accent: ColorRamp
        accentSecondary: ColorRamp
        danger: ColorRamp
        success: ColorRamp
        warning: ColorRamp
        pastelBlue: ColorRamp
        pastelPink: ColorRamp
        overlays: {
            soft: string
            medium: string
            strong: string
        }
        gradients: {
            hero: string
            brand: string
            card: string
        }
    }
    typography: {
        fontFamily: string
        fontFamilyMono: string
        baseFontSize: string
        lineHeight: string
        headingLineHeight: string
        headingSizes: HeadingScale
        textSizes: TextScale
    }
    spacing: SpacingScale
    radii: RadiusScale
    shadows: ShadowScale
    transitions: TransitionScale
    states: StateTokens
    layout: LayoutScale
}

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown>
        ? RecursivePartial<T[P]>
        : T[P]
}
