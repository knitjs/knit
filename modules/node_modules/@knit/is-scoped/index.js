/* @flow */

type TIsScoped = (m: Array<string>) => boolean;
const isScoped: TIsScoped = (module) => module[0] === '@';

export default isScoped;
