/* @flow */

type TIsScoped = (m: string) => boolean;
const isScoped: TIsScoped = module => module[0] === "@";

export { isScoped };
