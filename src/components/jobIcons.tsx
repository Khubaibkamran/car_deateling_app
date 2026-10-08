import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../constants/theme';

type P = { size?: number; color?: string };

/** Box with an up arrow, used on the photo "upload" tile. */
export function UploadBoxIcon({ size = 24, color = colors.textSecondary }: P) {
  return (
    <Svg width={size} height={size} viewBox="-2.69 -3.625 30 30" fill="none">
      <Path
        d="M2.79 7.39125V18.0162C2.79 19.0725 3.22 20.0862 3.98625 20.8325C4.75858 21.5834 5.79403 22.0025 6.87125 22H17.7538C18.8363 22 19.8737 21.58 20.6387 20.8325C21.016 20.4667 21.3162 20.029 21.5216 19.5453C21.7271 19.0617 21.8336 18.5417 21.835 18.0162V7.39125M2.79 7.39125C1.6625 7.39125 0.75 6.49875 0.75 5.39875V2.7425C0.75 1.6425 1.66375 0.75 2.79 0.75H21.835C22.9625 0.75 23.875 1.6425 23.875 2.7425V5.39875C23.875 6.49875 22.9613 7.39125 21.835 7.39125M2.79 7.39125H21.835"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12.3125 11.375V17.625" stroke={color} strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap="round" />
      <Path
        d="M15.1788 14.0062L12.72 11.5475C12.6666 11.4938 12.6031 11.4512 12.5331 11.4222C12.4632 11.3931 12.3882 11.3782 12.3125 11.3782C12.2368 11.3782 12.1618 11.3931 12.0919 11.4222C12.0219 11.4512 11.9584 11.4938 11.905 11.5475L9.44625 14.0062"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Square checkbox: orange with a tick when done, grey outline when not. */
export function CheckboxIcon({ checked, size = 16 }: { checked: boolean; size?: number }) {
  const stroke = checked ? colors.primary : colors.textSecondary;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x={1.5} y={1.5} width={13} height={13} rx={3} stroke={stroke} strokeWidth={1.25} />
      {checked && (
        <Path d="M4.6 8.2L7 10.6L11.5 5.6" stroke={colors.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </Svg>
  );
}

export function CloseIcon({ size = 16, color = colors.text }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function ChatBubbleIcon({ size = 16, color = colors.text }: P) {
  return (
    <Svg width={size} height={size} viewBox="-0.5 -0.5 15.333 14.667" fill="none">
      <Path d="M4.83315 8.50028H9.49982M4.83315 5.16695H7.16649" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M8.61315 12.7603C11.4025 12.5756 13.6238 10.3223 13.8065 7.49362C13.8418 6.94028 13.8418 6.36695 13.8065 5.81362C13.6238 2.98562 11.4025 0.733616 8.61315 0.547616C7.64975 0.484128 6.68322 0.484128 5.71982 0.547616C2.93049 0.732949 0.709153 2.98562 0.526486 5.81428C0.491171 6.37373 0.491171 6.93484 0.526486 7.49428C0.593153 8.52428 1.04849 9.47828 1.58515 10.2836C1.89649 10.8469 1.69115 11.5503 1.36649 12.1656C1.13315 12.6089 1.01582 12.8303 1.10982 12.9903C1.20315 13.1503 1.41315 13.1556 1.83249 13.1656C2.66249 13.1856 3.22182 12.9509 3.66582 12.6236C3.91715 12.4376 4.04315 12.3449 4.12982 12.3343C4.21649 12.3236 4.38782 12.3943 4.72915 12.5343C5.03582 12.6609 5.39249 12.7389 5.71915 12.7609C6.66915 12.8236 7.66182 12.8236 8.61382 12.7609L8.61315 12.7603Z"
        stroke={color}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
