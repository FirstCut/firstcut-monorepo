rm -rf node_modules
yarn install
while read in; do yarn add file:../$in; done < firstcut.packages.txt
