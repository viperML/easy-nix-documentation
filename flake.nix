{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      packages.${system} = {
        lib =
          with pkgs;
          buildNpmPackage {
            name = "easy-nix-documentation";
            src = ./.;
            npmDeps = importNpmLock {
              npmRoot = ./.;
              package = builtins.readFile ./src/package.json |> builtins.fromJSON;
              packageLock = builtins.readFile ./package-lock.json |> builtins.fromJSON;
            };
            npmWorkspace = "src";
            npmConfigHook = importNpmLock.npmConfigHook;
            dontFixup = true;
          };

          example = with pkgs; buildNpmPackage {
            name = "test";
            src = ./.;
            npmDeps = importNpmLock {
              npmRoot = ./.;
              package = builtins.readFile ./example/package.json |> builtins.fromJSON;
              packageLock = builtins.readFile ./package-lock.json |> builtins.fromJSON;
            };
            npmWorkspace = "example";
            npmConfigHook = importNpmLock.npmConfigHook;
            dontFixup = true;
            nativeBuildInputs = [
              strace
            ];
            buildPhase = ''
              pushd src
              npm run build
            '';
          };
      };

      devShells.${system}.default =
        with pkgs;
        mkShell {
          packages = [
            nodejs
          ];
        };
    };
}
