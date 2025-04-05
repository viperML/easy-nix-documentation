{
  lib,
  ...
}:
let
  inherit (lib) types;
in
{
  options.test = {
    extraLuaPackages = lib.mkOption {
      type = types.functionTo (types.listOf types.package);
      default = _: [ ];
      description = "A function which returns a list of extra needed lua packages";
      example = lib.literalExpression ''
        ps: [ ps.jsregexp ]
      '';
    };
  };
}
