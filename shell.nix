let
  sources = import ./npins;
  pkgs = import sources.nixpkgs { };
  treefmt-nix = import sources.treefmt-nix;
  treefmtEval = (
    treefmt-nix.mkWrapper pkgs ({
      projectRootFile = "shell.nix";
      programs.nixfmt.enable = true;
      programs.prettier.enable = true;
    })
  );
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    npins
    lix
    typescript-language-server
    treefmtEval
  ];
}
