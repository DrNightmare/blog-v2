export interface ColorScheme {
    id: string;
    name: string;
    colors: {
        // Light mode colors
        primary: string;
        primaryHover: string;
        primaryLight: string;
        primarySubtle: string;

        // Dark mode colors (optional overrides)
        primaryDark?: string;
        primaryHoverDark?: string;
        primaryLightDark?: string;
        primarySubtleDark?: string;
    };
}

export const colorSchemes: ColorScheme[] = [
    {
        id: 'indigo',
        name: 'Indigo Classic',
        colors: {
            primary: '#4f46e5',
            primaryHover: '#4338ca',
            primaryLight: '#e0e7ff',
            primarySubtle: '#eef2ff',
            primaryDark: '#818cf8',
            primaryHoverDark: '#a5b4fc',
            primaryLightDark: '#1e1b4b',
            primarySubtleDark: '#312e81',
        },
    },
    {
        id: 'emerald',
        name: 'Forest Green',
        colors: {
            primary: '#10b981',
            primaryHover: '#059669',
            primaryLight: '#d1fae5',
            primarySubtle: '#ecfdf5',
            primaryDark: '#34d399',
            primaryHoverDark: '#6ee7b7',
            primaryLightDark: '#064e3b',
            primarySubtleDark: '#065f46',
        },
    },
    {
        id: 'cyan',
        name: 'Ocean Blue',
        colors: {
            primary: '#06b6d4',
            primaryHover: '#0891b2',
            primaryLight: '#cffafe',
            primarySubtle: '#ecfeff',
            primaryDark: '#22d3ee',
            primaryHoverDark: '#67e8f9',
            primaryLightDark: '#164e63',
            primarySubtleDark: '#155e75',
        },
    },
];

export const defaultScheme = colorSchemes[0];
