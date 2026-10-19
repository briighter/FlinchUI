/**
 * React Native parity snippets, keyed by component slug.
 *
 * These are documentation-only: they show how the same component maps onto
 * native primitives while keeping the prop names and design tokens. They are
 * rendered as a "React Native" section on the matching component page. There is
 * no native package yet, and no live native preview.
 */

export const nativeSnippets: Record<string, string> = {
  button: `import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/theme';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  onPress?: () => void;
}

export function Button({ label, variant = 'primary', disabled, onPress }: ButtonProps) {
  const primary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.outline,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={primary ? styles.primaryLabel : styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 40, paddingHorizontal: 16, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: theme.brand },
  outline: { borderWidth: 1, borderColor: theme.border },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { color: theme.fg, fontSize: 14, fontWeight: '500' },
  primaryLabel: { color: theme.brandForeground, fontSize: 14, fontWeight: '500' },
});`,

  stack: `import type { ReactNode } from 'react';
import { View } from 'react-native';

export function VStack({ gap = 8, children }: { gap?: number; children: ReactNode }) {
  return <View style={{ flexDirection: 'column', gap }}>{children}</View>;
}

export function HStack({ gap = 8, children }: { gap?: number; children: ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>{children}</View>;
}`,

  heading: `import { StyleSheet, Text, type TextProps } from 'react-native';
import { theme } from '@/theme';

const SIZES = { 1: 30, 2: 24, 3: 20, 4: 18 } as const;

export function Heading({
  level = 1,
  children,
  ...rest
}: TextProps & { level?: keyof typeof SIZES }) {
  return (
    <Text
      accessibilityRole="header"
      style={[styles.base, { fontSize: SIZES[level] }]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: theme.fg, fontWeight: '700', letterSpacing: -0.3 },
});`,

  text: `import { StyleSheet, Text, type TextProps } from 'react-native';
import { theme } from '@/theme';

const TONE = {
  default: theme.fg,
  muted: theme.fgMuted,
  subtle: theme.fgSubtle,
} as const;

export function Text({
  tone = 'default',
  children,
  ...rest
}: TextProps & { tone?: keyof typeof TONE }) {
  return (
    <Text style={[styles.base, { color: TONE[tone] }]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { fontSize: 15, lineHeight: 22 },
});`,

  card: `import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: 16,
    gap: 12,
  },
});`,

  badge: `import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

export function Badge({ children }: { children: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.brandSubtle,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  label: { color: theme.brand, fontSize: 12, fontWeight: '600' },
});`,

  input: `import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { theme } from '@/theme';

export function Input({
  label,
  ...rest
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.fgSubtle}
        style={styles.input}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { color: theme.fg, fontSize: 14, fontWeight: '500' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    color: theme.fg,
    paddingHorizontal: 12,
    fontSize: 15,
  },
});`,

  switch: `import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/theme';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
}

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={() => onCheckedChange?.(!checked)}
    >
      <View style={[styles.track, checked && styles.trackOn]}>
        <View style={[styles.thumb, checked && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 24, borderRadius: 999, padding: 2, backgroundColor: theme.border },
  trackOn: { backgroundColor: theme.brand },
  thumb: { width: 20, height: 20, borderRadius: 999, backgroundColor: '#fff' },
  thumbOn: { transform: [{ translateX: 20 }] },
});`,

  alert: `import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

export function Alert({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View accessibilityRole="alert" style={styles.alert}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    gap: 4,
    borderWidth: 1,
    borderColor: theme.info,
    backgroundColor: theme.infoSubtle,
    borderRadius: theme.radius.lg,
    padding: 16,
  },
  title: { color: theme.fg, fontSize: 14, fontWeight: '600' },
  body: { color: theme.fgMuted, fontSize: 14, lineHeight: 20 },
});`,
};
