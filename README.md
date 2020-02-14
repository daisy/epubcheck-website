# EPUBCheck Website

## Purpose

* Download EPUBCheck
* End-user documentation
* Developer documentation
* About page with donors section

## Site architecture

This is an [11ty](http://www.11ty.io/) project. 

* Build with `$ npm run build`
* Serve the files locally with `$ npm run serve`. Browse to [localhost:8080](http://localhost:8080).
* Pretty-format the HTML and CSS output with `$ gulp`

Source files are in `src`. They are typically in `markdown` or [`nunjucks`](https://mozilla.github.io/nunjucks/) format.

Documentation files are in `src/docs`. The indices for documentation sections live in the corresponding `json` file, e.g. `dev.json` or `user.json`. Each documentation page must have the tag `docs` (added automatically for the `dev` and `user` folders; you need to add it yourself if you add another folder).

## Features

#### Versioned documentation

This site will automatically grab old versions of itself and make those versions available under the "Documentation" page. 

A user browsing an older version gets a warning that they are not looking at the most current version.

### About the build process

When you run `npm run build`, it builds the site twice: once to `_site`, and once to `_site/version/xxx`. 

It is necessary to build a second copy of the site in a versioned subdirectory, because the links will be different than in the top-level site. We also remove versions.js in this copy, just to reduce confusion, since it should never be called directly (rather, the top-level version should always be used).

Then, in the `postbuild` step, it zips up the contents of `_site/version/xxx` and puts it in `_site/history`. Then the original `_site/version/xxx` directory is deleted.

Also during `postbuild`, previous zipped versions of the site are downloaded from the live server (or localhost if you're testing), inflated, and served up in a `_site/version/xxx` subdirectory.

The zipped archives are also served up under `_site/history`, along with the current version's zip, because future builds of the site will need them.

### Settings

#### Environment variables

* `DOCSSITE_VERSION`: The version, auto-populated from `$TRAVIS_TAG`
* `DOCSSITE_WRITE_VERSION`: Write to a special version-number subdirectory. Set automatically.
* `DOCSSITE_HISTORY_URL`: The URL to download history zipfiles from, e.g. `http://example.com/mysite/history`
* `DOCSSITE_ROOT_SUBDIR`: The base subdirectory for the site, e.g. for `http://example.com/mysite`, the value should be `mysite`.
* `URL`: The complete URL for the website. 

#### Data files

##### `site.json`

* `title`: Title of the site
* `docsSubdir`: This is a magic string that will always be meaningful across versions as the home of the documentation section (even if it just redirects to elsewhere).

*Do not* use beginning or ending slashes with this property.

##### `versions.json`

Array of all versions to date.

##### `githubReleases.js`

Gets the latest EPUBCheck release from GitHub and makes the download info for it available to page templates.

##### `env.js`

Environment variables, made available to page templates.