wasm-pack build --target no-modules

PUSHD .
cd pkg
call npm link
POPD

PUSHD .
cd site
call npm link amfnwasm
POPD