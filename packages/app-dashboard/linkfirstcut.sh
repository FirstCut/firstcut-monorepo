
clean()
{
  rm -rf node_modules
}

install_external_packages()
{
  meteor npm install
  meteor npm install bcrypt
}

link_firstcut_packages()
{
  while read in; do meteor npm link ../$in; done < firstcut.packages.txt
}

add_packages_to_packagesJSON()
{
  while read in
  do
    tmp=(mktemp)
    touch $tmp
    jq ".dependencies+={\"$in\": \"^0.0.0\"}" package.json > $tmp && mv "$tmp" package.json
  done < firstcut.packages.txt
}

clean
install_external_packages
link_firstcut_packages
add_packages_to_packagesJSON
