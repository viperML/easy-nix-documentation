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
        default =
          with pkgs;
          stdenv.mkDerivation (final: {
            name = "example";

            src = ./.;
            nativeBuildInputs = [
              nodejs
              pnpm.configHook
            ];
            pnpmDeps = pnpm.fetchDeps {
              pname = final.name;
              inherit (final) src;
              hash = "sha256-02HxFkAQPGGC/z0MCg2qn18unq6Vk0y2/49Xug1cLF4=";
            };
            env.OPTIONS_JSON = self.packages.${system}.exampleOptionsJSON;
            buildPhase = ''
              pnpm build
            '';
            installPhase = ''
              pwd
              ls -la
              mv example/.vitepress/dist $out
            '';
          });

        exampleOptionsJSON =
          (pkgs.nixosOptionsDoc {
            options =
              (nixpkgs.lib.nixosSystem {
                inherit system;
                modules = [
                  ./test-module.nix
                ];
              }).options;
          }).optionsJSON;
      };

      devShells.${system}.default =
        with pkgs;
        mkShell {
          packages = [
            (nodejs.override { enableNpm = false; })
            pnpm
          ];
          env.OPTIONS_JSON = self.packages.${system}.exampleOptionsJSON;
        };
    };
}
