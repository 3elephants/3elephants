DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
parcel watch DIR/../src/popup.html DIR/../src/options_menu.html DIR/../src/controller.js DIR/../src/background.js  --out-dir DIR/../../dist/ --public-url '.'
