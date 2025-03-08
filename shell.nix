with import <nixpkgs> {};
mkShell {
  packages = [
    (nodejs.override {enableNpm = false;})
    pnpm
  ];
}
