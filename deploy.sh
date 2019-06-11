#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run lint
npm run build
npm publish
npm run docs:build

# cd 到构建输出的目录下
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:falstack/vue-mixin-store.git master:gh-pages

cd -
git add -A
git commit -m 'update'
git push origin master
