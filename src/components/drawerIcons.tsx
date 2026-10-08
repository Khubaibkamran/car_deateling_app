import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../constants/theme';

type P = { size?: number; color?: string };

const base = { fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function BookingsIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={4} y={3.5} width={16} height={17.5} rx={3} stroke={color} {...base} />
      <Path d="M8.5 8.5H15.5M8.5 12.5H15.5M8.5 16.5H12.5" stroke={color} {...base} />
    </Svg>
  );
}

export function CardIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={5.5} width={18} height={13} rx={3} stroke={color} {...base} />
      <Path d="M3 10H21M7 14.5H10" stroke={color} {...base} />
    </Svg>
  );
}

export function HelpIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke={color} {...base} />
      <Path d="M9.6 9.5C9.8 8.2 10.8 7.5 12 7.5C13.3 7.5 14.4 8.4 14.4 9.6C14.4 11.5 12 11.4 12 13.2" stroke={color} {...base} />
      <Circle cx={12} cy={16.6} r={0.6} fill={color} stroke={color} strokeWidth={0.8} />
    </Svg>
  );
}

export function SettingsIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 7H13M17 7H20M4 17H7M11 17H20M4 12H20" stroke={color} {...base} />
      <Circle cx={15} cy={7} r={2} stroke={color} {...base} />
      <Circle cx={9} cy={17} r={2} stroke={color} {...base} />
    </Svg>
  );
}

/** Open bracket with an arrow leaving it, as in the Logout design. */
export function LogoutIcon({ size = 24, color = colors.text }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M13 4H8.5C7.1 4 6 5.1 6 6.5V17.5C6 18.9 7.1 20 8.5 20H13"
        stroke={color}
        {...base}
        strokeWidth={2}
      />
      <Path d="M11 12H20M16.5 8.5L20 12L16.5 15.5" stroke={color} {...base} strokeWidth={2} />
    </Svg>
  );
}

export function BriefcaseIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3.5} y={7.5} width={17} height={12} rx={3} stroke={color} {...base} />
      <Path d="M9 7.5V6.5C9 5.7 9.7 5 10.5 5H13.5C14.3 5 15 5.7 15 6.5V7.5M3.5 12.5H20.5" stroke={color} {...base} />
    </Svg>
  );
}

export function DocumentIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 3.5H13.5L18.5 8.5V19.5C18.5 20.6 17.6 21.5 16.5 21.5H7C5.9 21.5 5 20.6 5 19.5V5.5C5 4.4 5.9 3.5 7 3.5Z" stroke={color} {...base} />
      <Path d="M13 3.7V9H18.3M8.5 13H15M8.5 17H13" stroke={color} {...base} />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 18, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9.5 5.5L16 12L9.5 18.5" stroke={color} {...base} strokeWidth={2} />
    </Svg>
  );
}

export function SendIcon({ size = 20, color = colors.white }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 3.5L10.5 14M21 3.5L14.5 20.5L10.5 14L3.5 10L21 3.5Z" stroke={color} {...base} strokeWidth={2} />
    </Svg>
  );
}

export function ShieldIcon({ size = 22, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3L19 6V11.5C19 15.9 16 19.4 12 21C8 19.4 5 15.9 5 11.5V6L12 3Z" stroke={color} {...base} />
      <Path d="M9 12L11 14L15 10" stroke={color} {...base} />
    </Svg>
  );
}

// ---- notification type icons ----

export function BellRingIcon({ size = 22, color = colors.primary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6.5 16.5V11C6.5 8 8.7 5.8 12 5.8C15.3 5.8 17.5 8 17.5 11V16.5L19 18H5L6.5 16.5Z" stroke={color} {...base} />
      <Path d="M10 20.5C10.4 21.2 11.1 21.5 12 21.5C12.9 21.5 13.6 21.2 14 20.5M12 3.5V5.8" stroke={color} {...base} />
    </Svg>
  );
}

export function TagIcon({ size = 22, color = colors.primary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3.5 12.2V5.5C3.5 4.4 4.4 3.5 5.5 3.5H12.2C12.7 3.5 13.2 3.7 13.6 4.1L20 10.5C20.8 11.3 20.8 12.6 20 13.4L13.4 20C12.6 20.8 11.3 20.8 10.5 20L4.1 13.6C3.7 13.2 3.5 12.7 3.5 12.2Z" stroke={color} {...base} />
      <Circle cx={8} cy={8} r={1.4} stroke={color} {...base} />
    </Svg>
  );
}

export function TrashIcon({ size = 18, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4.5 7H19.5M10 3.5H14M6.5 7L7.3 19C7.4 20.1 8.2 20.5 9 20.5H15C15.8 20.5 16.6 20.1 16.7 19L17.5 7M10 11V16.5M14 11V16.5" stroke={color} {...base} />
    </Svg>
  );
}
