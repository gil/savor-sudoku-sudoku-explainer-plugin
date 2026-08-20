# savor-sudoku-sudoku-explainer-plugin

[SudokuExplainer](https://github.com/gil/SudokuExplainer-ts) as a Savor Sudoku
engine plugin. Implements `savor-sudoku-plugin-api`'s `EngineProvider` and
builds to a single self-contained ESM worker bundle.

Licensed **LGPL-2.1-or-later**, matching upstream. See `LICENSE`.

Declares `generate`, `rate`, and `hint`. Only `generate` has a method in the
current protocol.
