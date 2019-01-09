import { ProtocolAnswer } from '../../protocol';

interface FormatCreation {
  name: string;
  id: string;
  valueToName: (name: string) => string;
  unit: string;
}

export default function makeFormatSettingAnswer(
  creation: FormatCreation
): (answer: ProtocolAnswer) => any {
  const { valueToName, name, unit } = creation;

  return (answer: ProtocolAnswer): any => {
    const { id, value } = answer;
    const computedValue = valueToName && value ? valueToName(value) : value;
    const displayValue = unit ? `${computedValue} ${unit}` : `${computedValue}`;
    return {
      id,
      name,
      value,
      unit,
      displayValue
    };
  };
}
