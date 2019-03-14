DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
parcel watch DIR/../src/controller.js DIR/../src/background.js DIR/../src/sort_script.js --out-dir DIR/../../dist/ --public-url '.'
