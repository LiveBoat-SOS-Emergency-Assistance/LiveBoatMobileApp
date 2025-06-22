export const SOSType = {
  DANGER: 'DANGER',
  MEDICAL: 'MEDICAL',
  VEHICLE: 'VEHICLE',
  DISASTER: 'DISASTER',
  THREATENED: 'THREATENED',
  LOST: 'LOST',
  UNSAFE: 'UNSAFE',
  UNSPECIFIED: 'UNSPECIFIED',
};

export const SOSTypeDisplay = {
  [SOSType.DANGER]: '🚨 I’m in Danger',
  [SOSType.MEDICAL]: '🏥 Medical Emergency',
  [SOSType.VEHICLE]: '🚗 Vehicle Trouble',
  [SOSType.DISASTER]: '🔥 Disaster Nearby',
  [SOSType.THREATENED]: '🏃 Threatened',
  [SOSType.LOST]: '📍 I’m Lost',
  [SOSType.UNSAFE]: '😰 I Feel Unsafe',
  [SOSType.UNSPECIFIED]: '❓ Unspecified',
};