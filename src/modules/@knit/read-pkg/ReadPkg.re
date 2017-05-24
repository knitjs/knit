/*type syncOptions = {normalize: bool};*/
external sync : Js.String.t => _ [@bs.as {json|{normalize: bool}|json}] => string =
  "" [@@bs.module "read-pkg"];

let readPkg dir_path package => {
  let ret = sync (PathJoin.pathJoin dir_path package) {normalize: false};
  ()
};