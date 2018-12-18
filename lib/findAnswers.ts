import { FrameType, mapToFrameType } from './FrameType';

export interface Answer {
  type: FrameType;
  id?: string;
  value?: string;
  raw: string;
}

export interface FindAnswerResult {
  answers: Answer[];
  remaining: string[];
}

const FRAME_PATTERN = /%(\w{2})#(\w+)\$(\w+)\r/;

export function findAnswers(data: string[]): FindAnswerResult {
  let index = 0;
  let lastFoundEndIndex = data.length;
  const answers: Answer[] = [];

  while (index < data.length) {
    if (data[index] === '?') {
      answers.push({
        type: FrameType.INVALID,
        raw: '?'
      });
    }
    if (data[index] === '%') {
      const found = data
        .slice(index)
        .join('')
        .match(FRAME_PATTERN);

      if (found) {
        const [raw, type, id, value] = found;
        answers.push({
          type: mapToFrameType(type),
          id,
          value,
          raw
        });
        index += raw.length - 1;
        lastFoundEndIndex = index;
      }
      index++;
    } else {
      index++;
    }
  }
  return {
    answers,
    remaining: data.slice(lastFoundEndIndex + 1)
  };
}
