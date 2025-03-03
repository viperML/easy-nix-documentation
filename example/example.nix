let
  pkgs = import <nixpkgs> { };
  nixos = import <nixpkgs/nixos> {
    configuration = { };
  };
in
pkgs.nixosOptionsDoc {
  inherit (nixos) options;
}
