import * as debugLib from 'debug';
import { Observable } from 'rxjs';
import { DomainAnswer, DomainCommand } from './domain';
import { commandHandlerFactories } from './domain';
import { buildCommand, findAnswers } from './protocol';
import { createCommandRunner, createTransport } from './tools';

export interface Communicator {
  open: (portName: string) => Promise<void>;
  close: () => Promise<void>;
  sendCommand: (command: DomainCommand) => Promise<DomainAnswer>;
  data$: Observable<{}>;
  answer$: Observable<{}>;
}

export function createCommunicator(): Communicator {
  const debug = debugLib('communicator');
  const transport = createTransport();
  const commandRunner = createCommandRunner({
    debug: debug.log,
    buildCommand,
    findAnswers,
    handlerFactories: [...commandHandlerFactories.measurements],
    data$: transport.data$,
    transport
  });

  return {
    open,
    close,
    get data$() {
      return transport.data$;
    },
    get answer$() {
      return commandRunner.answer$;
    },
    sendCommand
  };

  function open(portName: string): Promise<void> {
    return transport.connect(portName);
  }

  function close(): Promise<void> {
    return transport.disconnect();
  }

  function sendCommand(command: DomainCommand): Promise<any> {
    return commandRunner.postCommand(command);
  }
}