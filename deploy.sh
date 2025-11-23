npm run build
git add dist 
git commit -m 'Deploying dist'
git subtree push --prefix dist origin github-pages
