import { DomainCommandHandlerFatory } from '../DomainTypes';
import createReadMeasurementHandler from './createReadMeasurementHandler';

export const factories: DomainCommandHandlerFatory[] = [
  createReadMeasurementHandler
];
