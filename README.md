# Apache Mynewt Documentation

### Contents
 * [Writing Documentation](#writing-documentation)
 * [Preview Changes](#preview-changes)
 * [Setup (macOS)](#setup-macos)
   * [Prerequisites](#prerequisites)
   * [Toolchain Install](#toolchain-install)
 * [Setup (Linux)](#setup-linux)
 * [Deploying the latest docs](#deploying-the-latest-docs)
 * [Creating a versioned set of docs](#creating-a-versioned-set-of-docs)

This is the project documentation for the [Apache Mynewt](https://mynewt.apache.org/) project. It is built using [Sphinx](https://www.sphinx-doc.org/).

Each component of Mynewt contains its own specific documentation in its repo under `docs`. At
build time these are combined to create the full document set for publication.

The [Apache Mynewt](https://mynewt.apache.org/) source code also contains inline comments in [Doxygen](https://www.doxygen.nl/) format to document its APIs.

## Writing Documentation

[Sphinx](https://www.sphinx-doc.org/) uses [reStructuredText](http://www.sphinx-doc.org/en/stable/rest.html).

Embedding [Doxygen](https://www.doxygen.nl/) generated source documentation is through the [Breathe](https://breathe.readthedocs.io/)
bridge. This bridge embeds source
documentation using [Sphinx](https://www.sphinx-doc.org/)'s C domain.
For example:
`.. doxygenfile:: full/include/console/console.h`

Documents can then refer to code elements using the [C domain syntax](https://www.sphinx-doc.org/en/master/usage/domains/c.html#cross-referencing-c-constructs).
For example: `` :c:func:`console_read()` `` or `` :c:data:`console_input` ``.

Linking to other files should be relative for ease of deployment and multi-version
support. For example `` :doc: `../../newt/install/newt_mac` ``.

## Preview Changes

`make clean && make docs && (cd _build/html && python -m SimpleHTTPServer 8080)`

## Setup (macOS)

Note: This build toolchain is known to work on macOS 10.11.

### Prerequisites

* [Homebrew](https://brew.sh/)

```bash
$ brew --version
Homebrew 1.1.7
```
* python

```bash
$ python --version
Python 2.7.10
```
* [pip](https://pip.pypa.io/en/stable/installation/)

```bash
$ pip --version
pip 9.0.1 from /Library/Python/2.7/site-packages (python 2.7)
```

### Toolchain Install

```bash
$ git clone https://github.com/sphinx-doc/sphinx.git sphinx

$ cd sphinx && sudo -E python setup.py install && cd ..

$ git clone https://github.com/michaeljones/breathe.git breathe

$ cd breathe && sudo -E python setup.py install && cd ..

$ brew install doxygen

$ sudo pip install recommonmark
```
## Setup (Linux)

Most Linux distributions provide necessary packages in their repositories.

Ubuntu/Debian
```bash
sudo apt-get install doxygen python3-breathe python3-recommonmark
```
Fedora

```bash
sudo dnf install doxygen python3-breathe python3-recommonmark
```

## Deploying the latest docs

NOTE: These instructions assume that your workspace has all the mynewt repos
cloned under the same parent directory. 

* Ensure that all changes are merged into `master` and that the `master`
  branch is checked out.
* Repeat for any mynewt code repo that has documentation changes.
* Follow the steps at [Site Docs](https://github.com/apache/mynewt-site#deploying-the-latest-docs) to release the docs.

## Creating a versioned set of docs

When the `master`/`latest` documentation is deemed representative of a Mynewt
version, it is time to create a versioned set.

* Make sure all your mynewt-* repos are up to date and that all changes are
  merged and committed.
* Add the new version to mynewt-documentation/docs/themes/mynewt/versions.html

  * Also add the new version to any existing archived set.
  * i.e `mynewt-documentation/versions/*/mynewt-documentation/docs/themes/mynewt/versions.html`
  * Make sure the 'selected' flag is correct for the archived version

* Make a versions/vX_Y_Z directory
* Copy mynewt-documentation/* (except versions!) into versions/vX_Y_Z/mynewt-documentation
* Copy the mynewt-core repo into versions/vX_Y_Z/mynewt-core
* Repeat for other mynewt-* repos with doxygen docs and a /docs folder
* Update the version fields in

  * `docs/conf.py`
  * and `versions/vX_Y_Z/mynewt-documentation/docs/conf.py`

* Add a warning that this is not the most recent documentation to:

  * mynewt-documentation/versions/vX_Y_Z/mynewt-documentation/docs/themes/mynewt/layout.html
  * see an existing older version for example

To preview the changes:
```bash
cd mynewt-documentation/versions/vX_Y_Z/mynewt-documentation
make clean && make docs && (cd _build/html && python -m SimpleHTTPServer 8080)
```
