# Changelog

## \[0.5.5]

- [`92af617`](https://github.com/johncarmack1984/my-tauri-updater/commit/92af61722146ae3fa67cb835b91f3572f9527f96) Fix issue where stable release binary name would have pre-release syntax in Windows NT/MSI installers

## \[0.5.4]

- [`b3df7c8`](https://github.com/johncarmack1984/my-tauri-updater/commit/b3df7c88ed9bc3f9259d8865f767e02f3d31e3dc) Fix issue where stable release binary name would have pre-release syntax in Windows NT/MSI installers

## \[0.5.3]

- [`2c284a6`](https://github.com/johncarmack1984/my-tauri-updater/commit/2c284a659e15efd2b386bb92d1f7c31419821025) Cleaner, more automated, more readable, more modular check & publish workflows

## \[0.5.2]

- [`be9ff22`](https://github.com/johncarmack1984/my-tauri-updater/commit/be9ff229e9b89ef194ebba0237b7cddd127aaf1b) Explicitly set workflow lockfile handling

## \[0.5.1]

- [`72eebaa`](https://github.com/johncarmack1984/my-tauri-updater/commit/72eebaa76b6b11f9c5e6faf02d8741498237025a) Cleanup workflows
- [`8bdd604`](https://github.com/johncarmack1984/my-tauri-updater/commit/8bdd604752cc3aae98d7bc679aaff1b18e947c9a) Handle Windows versioning in workflows without prerelease syntax

## \[0.5.0]

- [`658a232`](https://github.com/johncarmack1984/my-tauri-updater/commit/658a232f0d9b6948331206a185cdbf9fd4f16820) Take updater out of pre-release and into stable.

## \[0.5.0-rc.6]

- [`838146b`](https://github.com/johncarmack1984/my-tauri-updater/commit/838146b637f34f27b96692abd9535275d7bccc56) Fix workflow

## \[0.5.0-rc.5]

- [`baecb39`](https://github.com/johncarmack1984/my-tauri-updater/commit/baecb39fea0f1e3e1690f7f7987fc3886fe8d03c) Apply new script to workflow runs.

## \[0.5.0-rc.4]

- [`f7a72cd`](https://github.com/johncarmack1984/my-tauri-updater/commit/f7a72cdbc7a9187e2cdccda56e374780e114cd6c) Get channel from node script

## \[0.5.0-rc.3]

- [`c9ad908`](https://github.com/johncarmack1984/my-tauri-updater/commit/c9ad908a78d2182dadd31456e71fd705a390cb88) Further reduce workflows needed

## \[0.5.0-rc.2]

- [`100a78f`](https://github.com/johncarmack1984/my-tauri-updater/commit/100a78f149b193f2b8e16bc4d63842e29232ce39) Simplify build setup in CI

## \[0.5.0-rc.1]

- [`a6a7790`](https://github.com/johncarmack1984/my-tauri-updater/commit/a6a77903c276e708e12d94a222bd59104f74dd30) set retention days (this is too many releases, setting these up is so annoying)

## \[0.5.0-rc.0]

- [`d2ce26b`](https://github.com/johncarmack1984/my-tauri-updater/commit/d2ce26b4ca4776762f68754960ff52c81af3153b) Move to pnpm

## \[0.4.3-rc.3]

- [`07205ab`](https://github.com/johncarmack1984/my-tauri-updater/commit/07205ab369430b8d1e84ed4042e46445447cc14f) Overhaul CI

## \[0.4.3-rc.2]

- [`9e75d01`](https://github.com/johncarmack1984/my-tauri-updater/commit/9e75d01cace9497f715ed95adc13c8d174f2ed79) Simplify setup of MSI versions

## \[0.4.3-rc.1]

- [`e461cb0`](https://github.com/johncarmack1984/my-tauri-updater/commit/e461cb073078a61e147ca55991b66fa8b64b33e5) Ensure prerelease versions use syntax that can be understood by Windows MSI installers

## \[0.4.3-rc.0]

- [`0b664ae`](https://github.com/johncarmack1984/my-tauri-updater/commit/0b664ae85a1fe7c6860679ba9e4b5b6fa291ea51) Move to release candidate channel.

## \[0.4.2]

- [`2b454c1`](https://github.com/johncarmack1984/my-tauri-updater/commit/2b454c1bceca87bdf2e92945e5ed8638165cbb83) Trying out some different configs

## \[0.4.1]

- [`f832e76`](https://github.com/johncarmack1984/my-tauri-updater/commit/f832e76d5a352bcc14ff77c4802f6a0e7e672ccb) Further modularize workflows

## \[0.4.0]

- [`1769e48`](https://github.com/johncarmack1984/my-tauri-updater/commit/1769e48391b768e480af9c9a187bf3b574576f6c) Move to a stable build

## \[0.3.3-canary.2]

- [`8025622`](https://github.com/johncarmack1984/my-tauri-updater/commit/80256226206f29e48defbef68259da0b9a042d09) Split workflows into modules

## \[0.3.3-canary.1]

- [`d41582f`](https://github.com/johncarmack1984/my-tauri-updater/commit/d41582f9aa57cc2241563f4f27bc0bba5b7c136a) Fix the canary build.
- [`8a38e75`](https://github.com/johncarmack1984/my-tauri-updater/commit/8a38e75160e8795eb109c0676258c3ab4fb793b4) Use ./github/fixtures/matrix_publish.json to run most release builds

## \[0.3.3-canary.0]

- [`470962c`](https://github.com/johncarmack1984/my-tauri-updater/commit/470962c37ab54c02dec766f7088c9700628cab58) Add a canary build.

## \[0.3.2]

- [`f6e28b6`](https://github.com/johncarmack1984/my-tauri-updater/commit/f6e28b631e3af8142c74e129fc388bbee9feafa9) Handle release publishing on the GH side, storage on the S3 side

## \[0.3.1]

- [\`\`](https://github.com/johncarmack1984/my-tauri-updater/commit/undefined) Update covector config

## \[0.3.0]

- [`0d11e1a`](https://github.com/johncarmack1984/my-tauri-updater/commit/0d11e1ac8a1bc94f40eace7c29065c181d50fd28) Add covector for version management
