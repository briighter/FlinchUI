import type { ReactNode, SVGProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * FlinchUI icons are inline SVG components — no icon-font, no runtime, no
 * dependency. Each icon inherits `currentColor` and defaults to `size-4`, so you
 * can recolor and resize them with Tailwind utilities.
 *
 *   <CheckIcon className="size-5 text-success" />
 */
export type IconProps = SVGProps<SVGSVGElement>;

function createIcon(name: string, children: ReactNode, filled = false) {
  function Icon({ className, ...rest }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={filled ? undefined : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={cn('size-4 shrink-0', className)}
        {...rest}
      >
        {children}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const CheckIcon = createIcon('CheckIcon', <path d="M20 6 9 17l-5-5" />);
export const XIcon = createIcon('XIcon', <path d="M18 6 6 18M6 6l12 12" />);
export const PlusIcon = createIcon('PlusIcon', <path d="M12 5v14M5 12h14" />);
export const MinusIcon = createIcon('MinusIcon', <path d="M5 12h14" />);
export const ChevronDownIcon = createIcon('ChevronDownIcon', <path d="m6 9 6 6 6-6" />);
export const ChevronRightIcon = createIcon('ChevronRightIcon', <path d="m9 6 6 6-6 6" />);
export const ChevronLeftIcon = createIcon('ChevronLeftIcon', <path d="m15 6-6 6 6 6" />);
export const ChevronUpIcon = createIcon('ChevronUpIcon', <path d="m18 15-6-6-6 6" />);
export const ArrowRightIcon = createIcon('ArrowRightIcon', <path d="M5 12h14M13 6l6 6-6 6" />);
export const ArrowLeftIcon = createIcon('ArrowLeftIcon', <path d="M19 12H5M11 18l-6-6 6-6" />);
export const ArrowUpRightIcon = createIcon('ArrowUpRightIcon', <path d="M7 17 17 7M7 7h10v10" />);
export const GitBranchIcon = createIcon('GitBranchIcon', <><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>);
export const RefreshIcon = createIcon('RefreshIcon', <><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></>);
export const SearchIcon = createIcon('SearchIcon', <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const MenuIcon = createIcon('MenuIcon', <path d="M4 6h16M4 12h16M4 18h16" />);
export const MoreHorizontalIcon = createIcon('MoreHorizontalIcon', <><circle cx="12" cy="12" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>);
export const MoreVerticalIcon = createIcon('MoreVerticalIcon', <><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></>);
export const InfoIcon = createIcon('InfoIcon', <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>);
export const AlertTriangleIcon = createIcon('AlertTriangleIcon', <><path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>);
export const CheckCircleIcon = createIcon('CheckCircleIcon', <><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5" /></>);
export const XCircleIcon = createIcon('XCircleIcon', <><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" /></>);
export const SunIcon = createIcon('SunIcon', <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const MoonIcon = createIcon('MoonIcon', <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />);
export const PaletteIcon = createIcon('PaletteIcon', <><circle cx="12" cy="12" r="9" /><circle cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="8" r="1.2" fill="currentColor" stroke="none" /><circle cx="15.5" cy="10" r="1.2" fill="currentColor" stroke="none" /><path d="M12 21a3 3 0 0 1 0-6h.5a1.5 1.5 0 0 0 0-3H12" /></>);
export const TrashIcon = createIcon('TrashIcon', <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></>);
export const PencilIcon = createIcon('PencilIcon', <path d="M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16v4Z" />);
export const SettingsIcon = createIcon('SettingsIcon', <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a1.7 1.7 0 0 0-1.6-1H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 3.6V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 20.4 9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>);
export const UserIcon = createIcon('UserIcon', <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-3.3 3.6-6 8-6s8 2.7 8 6" /></>);
export const HomeIcon = createIcon('HomeIcon', <><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" /></>);
export const BellIcon = createIcon('BellIcon', <><path d="M18 8a6 6 0 1 0-12 0c0 7-2 9-2 9h16s-2-2-2-9" /><path d="M10.5 21a2 2 0 0 0 3 0" /></>);
export const MailIcon = createIcon('MailIcon', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></>);
export const PhoneIcon = createIcon('PhoneIcon', <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />);
export const LockIcon = createIcon('LockIcon', <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);
export const EyeIcon = createIcon('EyeIcon', <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffIcon = createIcon('EyeOffIcon', <><path d="M10.6 6.2A9.9 9.9 0 0 1 12 6c6.5 0 10 6 10 6a17.6 17.6 0 0 1-3.2 3.9M6.6 6.6C3.6 8.3 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.3-.9" /><path d="m2 2 20 20" /></>);
export const CopyIcon = createIcon('CopyIcon', <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>);
export const DownloadIcon = createIcon('DownloadIcon', <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 21h16" /></>);
export const UploadIcon = createIcon('UploadIcon', <><path d="M12 15V3M7 8l5-5 5 5" /><path d="M4 21h16" /></>);
export const ExternalLinkIcon = createIcon('ExternalLinkIcon', <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>);
export const FilterIcon = createIcon('FilterIcon', <path d="M4 5h16l-6 7v5l-4 2v-7Z" />);
export const CalendarIcon = createIcon('CalendarIcon', <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" /></>);
export const ClockIcon = createIcon('ClockIcon', <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const FileIcon = createIcon('FileIcon', <><path d="M14 3v5h5" /><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /></>);
export const FolderIcon = createIcon('FolderIcon', <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />);
export const CodeIcon = createIcon('CodeIcon', <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />);
export const LayersIcon = createIcon('LayersIcon', <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>);
export const BoxIcon = createIcon('BoxIcon', <><path d="M21 8 12 3 3 8v8l9 5 9-5Z" /><path d="M3 8l9 5 9-5M12 21V13" /></>);
export const SparklesIcon = createIcon('SparklesIcon', <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" /></>);
export const BoltIcon = createIcon('BoltIcon', <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />);
export const HeartIcon = createIcon('HeartIcon', <path d="M12 20s-7-4.3-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5C19 15.7 12 20 12 20Z" />);
export const StarIcon = createIcon('StarIcon', <path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.6l6.3-.9Z" />);
export const ThumbsUpIcon = createIcon('ThumbsUpIcon', <path d="M7 21V10l4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 16.8 21Z" />);
export const BookOpenIcon = createIcon('BookOpenIcon', <><path d="M12 6v14" /><path d="M2 5a15 15 0 0 1 10 1 15 15 0 0 1 10-1v13a15 15 0 0 0-10 1 15 15 0 0 0-10-1Z" /></>);
export const TerminalIcon = createIcon('TerminalIcon', <><path d="m5 8 4 4-4 4" /><path d="M12 16h7" /></>);
export const RocketIcon = createIcon('RocketIcon', <><path d="M5 15c-1 1.5-1 5-1 5s3.5 0 5-1a3 3 0 0 0-4-4Z" /><path d="M9 15 15 9" /><path d="M9 15l3 3 4.5-4.5c2.5-2.5 3-7 3-9.5-2.5 0-7 .5-9.5 3L5.5 12Z" /></>);
export const GaugeIcon = createIcon('GaugeIcon', <><path d="M12 14 16 9" /><path d="M3.5 18a9 9 0 1 1 17 0" /></>);
export const TableIcon = createIcon('TableIcon', <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 10v10M15 10v10" /></>);
export const LayoutIcon = createIcon('LayoutIcon', <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>);
export const SidebarIcon = createIcon('SidebarIcon', <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></>);
export const KeyboardIcon = createIcon('KeyboardIcon', <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></>);
export const GlobeIcon = createIcon('GlobeIcon', <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>);
export const MonitorIcon = createIcon('MonitorIcon', <><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>);
export const SmartphoneIcon = createIcon('SmartphoneIcon', <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>);
export const AccessibilityIcon = createIcon('AccessibilityIcon', <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="8" r="1.4" fill="currentColor" stroke="none" /><path d="M8 11h8M12 11v5M12 16l-2 4M12 16l2 4" /></>);
