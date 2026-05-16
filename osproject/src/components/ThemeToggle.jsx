import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

/**
 * ThemeToggle — icon-only button, Sun in dark mode, Moon in light mode.
 * Props:
 *   position: 'fixed' (default) | 'inline'
 *   style: extra inline styles
 */
export default function ThemeToggle({ position = 'fixed', style = {} }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className={`theme-toggle theme-toggle--${position}`}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={style}
    >
      {isDark
        ? <Sun size={17} strokeWidth={2} />
        : <Moon size={17} strokeWidth={2} />
      }
    </button>
  );
}
