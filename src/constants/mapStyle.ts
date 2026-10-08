// Soft grey map style (Google Maps JSON) to match the Track Technician design. Applied on Android;
// iOS uses the built-in `mutedStandard` map type for a similar look.
export const GRAY_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#e6e7e9' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5f6672' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f3f4f6' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#d5d8dc' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fafafa' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d2d5da' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c4c8ce' }] },
];
