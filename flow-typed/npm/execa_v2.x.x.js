// flow-typed signature: 462010dbbc24c91bfdc52e1663c5c464
// flow-typed version: f77e42db8d/execa_v2.x.x/flow_>=v0.104.x

declare module 'execa' {
  declare type StdIoOption =
    | 'pipe'
    | 'ipc'
    | 'ignore'
    | 'inherit'
    | stream$Stream
    | number;

  declare type CommonOptions = {|
    argv0?: string,
    cleanup?: boolean,
    cwd?: string,
    detached?: boolean,
    encoding?: string,
    env?: { [string]: string, ... },
    extendEnv?: boolean,
    gid?: number,
    killSignal?: string | number,
    localDir?: string,
    maxBuffer?: number,
    preferLocal?: boolean,
    reject?: boolean,
    shell?: boolean | string,
    stderr?: ?StdIoOption,
    stdin?: ?StdIoOption,
    stdio?: 'pipe' | 'ignore' | 'inherit' | $ReadOnlyArray<?StdIoOption>,
    stdout?: ?StdIoOption,
    stripEof?: boolean,
    timeout?: number,
    uid?: number,
    windowsVerbatimArguments?: boolean,
    buffer?: boolean,
    all?: boolean,
    stripFinalNewline?: boolean,
  |};

  declare type SyncOptions = {|
    ...CommonOptions,
    input?: string | Buffer,
  |};

  declare type Options = {|
    ...CommonOptions,
    input?: string | Buffer | stream$Readable,
  |};

  declare type SyncResult = {|
    stdout: string,
    stderr: string,
    exitCode: number,
    failed: boolean,
    signal: ?string,
    command: string,
    timedOut: boolean,
  |};

  declare type Result = {|
    ...SyncResult,
    killed: boolean,
  |};

  declare interface ExecaPromise extends Promise<Result>, child_process$ChildProcess {
    catch<E>(
      onrejected?: ?((reason: ExecaError) => E | Promise<E>)
    ): Promise<Result | E>;
    cancel: () => void;
  }

  declare interface ExecaError extends ErrnoError {
    stdout: string;
    stderr: string;
    failed: boolean;
    signal: ?string;
    command: string;
    timedOut: boolean;
    exitCode: number;
  }

  declare interface Execa {
    (file: string, args?: $ReadOnlyArray<string>, options?: $ReadOnly<Options>): ExecaPromise;
    (file: string, options?: $ReadOnly<Options>): ExecaPromise;

    command(command: string, options?: $ReadOnly<Options>): ExecaPromise;
    commandSync(command: string, options?: $ReadOnly<Options>): ExecaPromise;

    node(path: string, args?: $ReadOnlyArray<string>, options?: $ReadOnly<Options>): void;

    sync(file: string, args?: $ReadOnlyArray<string>, options?: $ReadOnly<SyncOptions>): SyncResult;
    sync(file: string, options?: $ReadOnly<SyncOptions>): SyncResult;
  }

  declare module.exports: Execa;
}
