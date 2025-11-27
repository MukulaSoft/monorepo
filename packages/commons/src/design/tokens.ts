export type ColorScale = {
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

export type CommonsTheme = {
    typography: {
        fontFamily: string
        headingWeight: number
        bodyWeight: number
    }
    colors: {
        primary: ColorScale
        neutral: ColorScale
        success: ColorScale
        danger: ColorScale
    }
    radii: {
        sm: string
        md: string
        lg: string
    }
    spacing: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
    }
}

export const commonsTheme: CommonsTheme = {
    typography: {
        fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        headingWeight: 600,
        bodyWeight: 400,
    },
    colors: {
        primary: {
            50: '#f2f6ff',
            100: '#d9e4ff',
            200: '#b3c8ff',
            300: '#8aa8ff',
            400: '#658cff',
            500: '#3c6eff',
            600: '#2e56d4',
            700: '#223fa1',
            800: '#162a6d',
            900: '#0b1538',
        },
        neutral: {
            50: '#f5f5f5',
            100: '#e0e0e0',
            200: '#c7c7c7',
            300: '#a8a8a8',
            400: '#8a8a8a',
            500: '#6f6f6f',
            600: '#545454',
            700: '#3c3c3c',
            800: '#252525',
            900: '#111111',
        },
        success: {
            50: '#e6f7f0',
            100: '#c1ebd9',
            200: '#93dcbf',
            300: '#63cda5',
            400: '#32bd89',
            500: '#1ba371',
            600: '#13805a',
            700: '#0c5d43',
            800: '#053b2b',
            900: '#021a14',
        },
        danger: {
            50: '#fff5f5',
            100: '#ffdada',
            200: '#ffb3b3',
            300: '#ff8a8a',
            400: '#ff5f5f',
            500: '#ff3434',
            600: '#d42424',
            700: '#a11919',
            800: '#6d0f0f',
            900: '#380505',
        },
    },
    radii: {
        sm: '4px',
        md: '8px',
        lg: '16px',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
}

export function createCssVariables(theme: CommonsTheme = commonsTheme) {
    const entries = [
        ['--commons-font-family', theme.typography.fontFamily],
        ['--commons-heading-weight', `${theme.typography.headingWeight}`],
        ['--commons-body-weight', `${theme.typography.bodyWeight}`],
        ['--commons-radius-sm', theme.radii.sm],
        ['--commons-radius-md', theme.radii.md],
        ['--commons-radius-lg', theme.radii.lg],
        ['--commons-spacing-xs', theme.spacing.xs],
        ['--commons-spacing-sm', theme.spacing.sm],
        ['--commons-spacing-md', theme.spacing.md],
        ['--commons-spacing-lg', theme.spacing.lg],
        ['--commons-spacing-xl', theme.spacing.xl],
    ] as const

    const colorEntries: Array<[string, string]> = []
    for (const [scaleName, scale] of Object.entries(theme.colors)) {
        for (const [step, value] of Object.entries(scale)) {
            colorEntries.push([`--commons-color-${scaleName}-${step}`, value])
        }
    }

    return Object.fromEntries([...entries, ...colorEntries])
}
