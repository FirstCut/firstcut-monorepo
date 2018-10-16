rm -rf node_modules
while read in; do yarn link $in; done < firstcut.packages.txt
yarn install
