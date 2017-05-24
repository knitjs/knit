external join : string => string => string = "" [@@bs.module "path"];

external sep : string = "" [@@bs.module "path"];

let pathJoin dir_path package => Js.String.replace "/" sep (join dir_path package);