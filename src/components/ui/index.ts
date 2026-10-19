/**
 * FlinchUI component library — barrel export.
 *
 * Every export here is copy-paste source you own. Importing from the barrel is
 * convenient for the docs site, but in an app you would copy only the components
 * you need. Individual modules are the source of truth.
 *
 *   import { Button, Card, Stack } from '@/components/ui';
 */

/* --------------------------------- layout --------------------------------- */
export { Box, type BoxProps } from './box';
export { Flex, type FlexProps } from './flex';
export { Stack, HStack, VStack, type StackProps, type HStackProps, type VStackProps } from './stack';
export { Container, type ContainerProps } from './container';
export { Grid, SimpleGrid, type GridProps, type SimpleGridProps } from './grid';
export { Separator, type SeparatorProps } from './separator';
export { AspectRatio, type AspectRatioProps } from './aspect-ratio';
export { VisuallyHidden, type VisuallyHiddenProps } from './visually-hidden';

/* ------------------------------- typography -------------------------------- */
export { Heading, headingSizeClasses, type HeadingProps, type HeadingLevel, type HeadingSize } from './heading';
export { Text, type TextProps } from './text';
export { Link, type LinkProps, type LinkTone } from './link';
export { Code, Kbd, Blockquote } from './code';
export { List, ListItem, type ListProps, type ListItemProps } from './list';
export { Label, type LabelProps } from './label';
export { Prose, type ProseProps } from './prose';

/* --------------------------------- actions --------------------------------- */
export {
  Button,
  buttonVariants,
  buttonSchema,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './button';
export { IconButton, type IconButtonProps } from './icon-button';
export { ButtonGroup, type ButtonGroupProps } from './button-group';
export { Toggle, type ToggleProps } from './toggle';
export { CopyButton, type CopyButtonProps } from './copy-button';
export { CloseButton, type CloseButtonProps } from './close-button';
export { Spinner, spinnerSizeClasses, type SpinnerProps, type SpinnerSize } from './spinner';

/* ---------------------------------- forms ---------------------------------- */
export {
  FormField,
  Fieldset,
  fieldSurface,
  fieldBorder,
  fieldHeight,
  fieldText,
  fieldPadX,
  type FormFieldProps,
  type FieldsetProps,
  type FieldSize,
} from './form-field';
export { Input, type InputProps } from './input';
export { Textarea, type TextareaProps } from './textarea';
export { Select, type SelectProps, type SelectOption } from './select';
export { Checkbox, type CheckboxProps } from './checkbox';
export { Switch, type SwitchProps } from './switch';
export { RadioGroup, type RadioGroupProps, type RadioOption } from './radio-group';
export { NumberInput, type NumberInputProps } from './number-input';
export { Slider, type SliderProps } from './slider';

/* ------------------------------- data display ------------------------------ */
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  cardSchema,
  type CardProps,
  type CardVariant,
  type CardTitleProps,
} from './card';
export { Badge, badgeVariants, badgeSchema, type BadgeProps, type BadgeTone } from './badge';
export {
  Avatar,
  AvatarGroup,
  getInitials,
  type AvatarProps,
  type AvatarGroupProps,
  type AvatarSize,
  type AvatarStatus,
} from './avatar';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableProps,
} from './table';
export { Skeleton, type SkeletonProps } from './skeleton';
export {
  Progress,
  CircularProgress,
  type ProgressProps,
  type CircularProgressProps,
  type ProgressTone,
} from './progress';
export { EmptyState, type EmptyStateProps } from './empty-state';
export { Stat, type StatProps, type Trend } from './stat';
export { DescriptionList, type DescriptionListProps, type DescriptionItem } from './description-list';
export { Timeline, type TimelineProps, type TimelineItem, type TimelineStatus } from './timeline';
export { Chip, type ChipProps } from './chip';
export { CodeBlock, type CodeBlockProps } from './code-block';

/* ---------------------------------- charts --------------------------------- */
export {
  CHART_TONE,
  CHART_TONE_SOFT,
  CHART_SERIES_TONES,
  type ChartTone,
} from './chart-shared';
export { Sparkline, type SparklineProps } from './sparkline';
export { LineChart, type LineChartProps, type LineChartSeries } from './line-chart';
export { BarChart, type BarChartProps, type BarChartSeries } from './bar-chart';
export { DonutChart, type DonutChartProps, type DonutSlice } from './donut-chart';
export { Heatmap, type HeatmapProps } from './heatmap';
export { ColorSwatch, type ColorSwatchProps } from './color-swatch';

/* -------------------------------- disclosure ------------------------------- */
export { Accordion, AccordionItem, type AccordionProps, type AccordionItemProps } from './accordion';
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
  type TabsVariant,
} from './tabs';
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
} from './collapsible';

/* --------------------------------- feedback -------------------------------- */
export { Alert, type AlertProps, type AlertTone } from './alert';
export { ToastProvider, useToast, type Toast, type ToastOptions, type ToastTone, type ToastProviderProps } from './toast';

/* --------------------------------- overlays -------------------------------- */
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  type DialogProps,
  type DialogHeaderProps,
  type DialogCloseProps,
} from './dialog';
export { Drawer, DrawerSection, type DrawerProps, type DrawerSide } from './drawer';
export { Popover, PopoverTrigger, PopoverContent, type PopoverProps } from './popover';
export { Tooltip, type TooltipProps } from './tooltip';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  type DropdownMenuProps,
  type DropdownMenuItemProps,
} from './dropdown-menu';

/* ------------------------------- navigation -------------------------------- */
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from './breadcrumb';
export { Pagination, type PaginationProps } from './pagination';
export { Stepper, type StepperProps, type Step } from './stepper';
export { Navbar, type NavbarProps, type NavItem } from './navbar';
export { Sidebar, type SidebarProps, type SidebarItem, type SidebarSection } from './sidebar';
export { Footer, type FooterProps, type FooterColumn } from './footer';
export { PageHeader, type PageHeaderProps } from './page-header';
export { AppShell, type AppShellProps } from './app-shell';
export { SkipLink, type SkipLinkProps } from './skip-link';

/* ---------------------------------- icons ---------------------------------- */
export * from './icons';
