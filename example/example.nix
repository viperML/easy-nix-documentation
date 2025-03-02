let

  pkgs = import <nixpkgs> { };
  inherit (pkgs) lib;
  inherit (lib) types;
  nixos = import <nixpkgs/nixos> {
    configuration = { };
  };
in
pkgs.nixosOptionsDoc {
  inherit (nixos) options;
}
