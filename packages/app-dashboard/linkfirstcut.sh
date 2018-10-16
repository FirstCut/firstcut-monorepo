rm -rf node_modules
yarn install
while read in; do yarn link $in; done < firstcut.packages.txt
meteor npm install bcrypt
tmp=$(mktemp)
while read in;
  jq '.packages.'$in = "^0.0.0" packages.json > "$tmp" && mv "$tmp" packages.json
done < firstcut.packages.txt
