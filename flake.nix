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
              pname = "example";
              inherit (final) src;
              hash = "sha256-Q8oVbsrAYJUuD4LhNGKvyvcQih/Vyh1qrmktQ3NL5cI";
            };
            env.OPTIONS_JSON = self.packages.${system}.exampleOptionsJSON;
            buildPhase = ''
              pushd src
              pnpm build
              popd

              pushd example
              exit_st=0
              pnpm build > build.log 2>&1 || {
                exit_st=$?
                :
              }
              cat build.log
              popd
              return $exit_st
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
                modules = [ ];
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
