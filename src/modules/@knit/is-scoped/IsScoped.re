/*let isScoped package => package.[0] === '@';*/
let isScoped (package: string) :Js.boolean =>
  Js.Boolean.to_js_boolean (Js.String.get package 0 === "@");