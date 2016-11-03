// flow-typed signature: 9f16be255e5c38ff891df5b8d6906d3d
// flow-typed version: 94e9f7e0a4/pretty-error_v2.x.x/flow_>=v0.23.x

declare module 'pretty-error' {
  declare class PrettyError {
    static constructor(): PrettyError;
    static start(): void;
    alias(toBeAliased: string, alias: string): void;
    appendStyle(style: Object): void;
    render(error: Error): void;
    skip(skipFn: (traceline: Object, lineNumber: number) => bool): void;
    skipNodeFiles(): void;
    skipPackage(...packages: string[]): void;
    skipPath(path: string): void;
    start(): void;
    withoutColors(): void;
  }
  declare var exports: Class<PrettyError>;
}
