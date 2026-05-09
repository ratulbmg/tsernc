import React, { useEffect, useState } from 'react';
import { IoIosMoon, MdSunny } from '../icons';
import { cn } from '../utils/cn';

export type Theme = 'light' | 'dark';

// Theme hook logic (internal, not exported)
const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Get initial theme from localStorage or default to 'light'
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'light';
    });

    useEffect(() => {
        // Apply theme to document on mount and when theme changes
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save theme to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark'
    };
};

// Theme Toggle Component
interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = ''
}) => {
    const { toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(`relative inline-flex h-8 w-16 items-center rounded-full bg-[#E8E8E8] dark:bg-[#595959] transition-colors duration-300 focus:outline-none ${className}`)}
        >
            {/* Toggle slider */}
            <span className={cn(`inline-block h-6 w-6 transform rounded-full bg-[#FAFAFA] dark:bg-[#383838] shadow-lg transition-transform duration-300 ${isDark ? 'translate-x-9' : 'translate-x-1'}`)}
            >
                {/* Icon inside the slider */}
                <span className={cn("flex h-full w-full items-center justify-center")}>
                    {isDark ? (
                        // Moon icon
                        <IoIosMoon className={cn("text-zinc-200")} />
                    ) : (
                        // Sun icon
                        <MdSunny className={cn("text-zinc-700")} />
                    )}
                </span>
            </span>
        </button>
    );
};

export default ThemeToggle;