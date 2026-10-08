import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../constants/theme';

type IconProps = { size?: number; color?: string };

/** Back arrow: the design's "arrow up" rotated a quarter turn to the left. */
export function BackIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '-90deg' }] }}>
      <Path
        d="M19.03 9.47L12.885 3.325C12.6492 3.09233 12.3313 2.96187 12 2.96187C11.6687 2.96187 11.3508 3.09233 11.115 3.325L4.97 9.47L6.03 10.53L11.25 5.31V21H12.75V5.31L17.97 10.53L19.03 9.47Z"
        fill={colors.text}
      />
    </Svg>
  );
}

export function ChevronDownIcon() {
  return (
    <Svg width={24} height={11} viewBox="0 0 24 11" fill="none">
      <Path
        d="M12 10.2143C11.9016 10.2155 11.8041 10.1952 11.7137 10.1546C11.6233 10.114 11.542 10.0541 11.475 9.97857L4.725 2.90714C4.425 2.59286 4.425 2.10571 4.725 1.79143C5.025 1.47714 5.49 1.47714 5.79 1.79143L12.015 8.31286L18.225 1.80714C18.525 1.49286 18.99 1.49286 19.29 1.80714C19.59 2.12143 19.59 2.60857 19.29 2.92286L12.54 9.99429C12.39 10.1514 12.195 10.23 12.015 10.23L12 10.2143Z"
        fill="white"
      />
    </Svg>
  );
}

export function UserIcon({ size = 24, color = colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4.5} stroke={color} />
      <Path
        d="M4 19.619C4 15.4112 7.41116 12 11.619 12H12.381C16.5888 12 20 15.4112 20 19.619C20 19.8294 19.8294 20 19.619 20H4.38095C4.17056 20 4 19.8294 4 19.619Z"
        stroke={color}
      />
    </Svg>
  );
}

export function EmailIcon({ size = 24, color = colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={21} y={5} width={14} height={18} rx={2} transform="rotate(90 21 5)" stroke={color} />
      <Path
        d="M7 9L10.8531 11.6972C11.5417 12.1792 12.4583 12.1792 13.1469 11.6972L17 9"
        stroke={color}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LockIcon({ size = 24, color = colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={9} width={14} height={12} rx={1} stroke={color} />
      <Path d="M8 8V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V8" stroke={color} />
      <Circle cx={12} cy={15} r={2} fill={color} />
    </Svg>
  );
}

/** The "Blind" eye from the design (shown for hidden text). `visible` adds the lower lid. */
export function EyeIcon({ size = 24, visible = false }: IconProps & { visible?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke="#E9E9EF" strokeWidth={2} />
      <Path d="M3 12C3 12 8 8 12 8C16 8 21 12 21 12" stroke="#E9E9EF" strokeWidth={2} strokeLinecap="round" />
      {visible && (
        <Path d="M3 12C3 12 8 16 12 16C16 16 21 12 21 12" stroke="#E9E9EF" strokeWidth={2} strokeLinecap="round" />
      )}
    </Svg>
  );
}

export function CheckIcon({ size = 12, color = colors.background }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7541 2.30098C12.0858 2.63922 12.0809 3.18272 11.7432 3.51493L4.59732 10.5439L0.256555 6.27414C-0.0811744 5.94194 -0.0860633 5.39844 0.245635 5.0602C0.577333 4.72196 1.12001 4.71706 1.45774 5.04926L4.59732 8.13746L10.542 2.29004C10.8798 1.95784 11.4224 1.96274 11.7541 2.30098Z"
        fill={color}
      />
    </Svg>
  );
}

export function AppleIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9279 1C16.1585 2.21 15.5821 3.42 14.8905 4.3C14.1988 5.18 12.9308 5.95 11.6628 5.84C11.4323 4.63 12.0086 3.53 12.7003 2.65C13.5072 1.77 14.7752 1.11 15.9279 1ZM19.6167 20.14C20.1931 19.26 20.5389 18.71 21 17.72C17.4265 16.4 16.8501 11.56 20.4236 9.8C19.3862 8.48 17.8876 7.82 16.389 7.82C15.3516 7.82 14.6599 8.04 13.9683 8.26C13.3919 8.48 12.9308 8.59 12.3545 8.59C11.6628 8.59 11.2017 8.37 10.5101 8.15C9.81843 7.93 9.12679 7.71 8.31987 7.71C6.70604 7.71 4.97693 8.59 3.93946 10.24C2.4409 12.44 2.67145 16.73 5.0922 20.25C6.12967 21.57 7.28241 23 8.78097 23C9.47261 23 9.81843 22.78 10.2795 22.67C10.8559 22.45 11.4323 22.23 12.3545 22.23C13.3919 22.23 13.853 22.45 14.4294 22.67C14.8905 22.89 15.2363 23 15.9279 23C17.5418 23 18.6945 21.35 19.6167 20.14Z"
        fill="white"
      />
    </Svg>
  );
}

export function GoogleIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12.464 6.65956C14.2411 6.65956 15.4398 7.42722 16.1233 8.0687L18.7943 5.46074C17.1539 3.93592 15.0192 3 12.464 3C8.76251 3 5.5658 5.12423 4.00951 8.21592L7.06951 10.5925C7.83714 8.31056 9.96127 6.65956 12.464 6.65956Z" fill="white" />
      <Path d="M21.5493 12.6747C21.5493 11.8965 21.4862 11.3286 21.3495 10.7397H12.4639V14.2521H17.6796C17.5745 15.1249 17.0066 16.4394 15.7448 17.3227L18.7312 19.6363C20.5188 17.9853 21.5493 15.5561 21.5493 12.6747Z" fill="white" />
      <Path d="M7.08001 14.3362C6.88021 13.7473 6.76454 13.1163 6.76454 12.4644C6.76454 11.8124 6.88024 11.1814 7.06951 10.5925L4.00951 8.21592C3.36806 9.49887 3 10.9395 3 12.4644C3 13.9892 3.36804 15.4299 4.00949 16.7128L7.08001 14.3362Z" fill="white" />
      <Path d="M12.4639 21.9287C15.0192 21.9287 17.1644 21.0875 18.7312 19.6363L15.7448 17.3227C14.9456 17.8801 13.873 18.2692 12.4639 18.2692C9.96123 18.2692 7.83712 16.6182 7.08001 14.3362L4.01998 16.7128C5.57627 19.8045 8.76246 21.9287 12.4639 21.9287Z" fill="white" />
    </Svg>
  );
}
