#!/bin/sh

shashort=$(git rev-parse --short HEAD)
sha=$(git rev-parse HEAD)

echo "$shashort $sha"

sed -i "s/commitRefShort/$shashort/" index.html

sed -i "s/commitRef/$sha/" index.html
