Apache Mynewt Documentation
###########################

.. contents::

This is the project documentation for the `Apache Mynewt`_ project. It is built using `Sphinx`_.

Each component of Mynewt contains its own specific documentation in its repo under ``docs``. At
build time these are combined to create the full document set for publication.

The `Apache Mynewt`_ source code also contains inline comments in `Doxygen`_ format to document its APIs.

Writing Documentation
=======================

`Sphinx`_ use reStructuredText. http://www.sphinx-doc.org/en/stable/rest.html.

Embedding `Doxygen`_ generated source documentation is through the `Breathe`_
bridge. http://breathe.readthedocs.io/en/latest/. This bridge embeds source
documentation using `Sphinx`_'s C domain. For example:
``.. doxygenfile:: full/include/console/console.h``

Documents can then refer to code elements using the C domain syntax:
http://www.sphinx-doc.org/en/stable/domains.html#cross-referencing-c-constructs
For example: ``:c:func:`console_read()``` or ``:c:data:`console_input```.

Linking to other files should be relative for ease of deployment and multi-version
support. For example ``:doc:`../../newt/install/newt_mac```.

Preview Changes
=================

``make clean && make docs && (cd _build/html && python -m SimpleHTTPServer 8080)``

Setup (MacOS)
===============

Note: This build toolchain is known to work on MacOS 10.11.

Prerequisites:
***************

* `homebrew`_

.. code-block:: bash

  $ brew --version
  Homebrew 1.1.7

* python

.. code-block:: bash

  $ python --version
  Python 2.7.10

* `pip`_

.. code-block:: bash

  $ pip --version
  pip 9.0.1 from /Library/Python/2.7/site-packages (python 2.7)


Toolchain Install:
*******************

.. code-block:: bash

   $ git clone https://github.com/sphinx-doc/sphinx.git sphinx

   $ cd sphinx && sudo -E python setup.py install && cd ..

   $ git clone https://github.com/michaeljones/breathe.git breathe

   $ cd breathe && sudo -E python setup.py install && cd ..

   $ brew install doxygen

   $ sudo pip install recommonmark

Setup (Linux)
===============

Most Linux distributions provide necessary packages in their repositories.

Ubuntu/Debian
.. code-block:: bash

   sudo apt-get install doxygen python3-breathe python3-recommonmark

Fedora
.. code-block:: bash

   sudo dnf install doxygen python3-breathe python3-recommonmark

Deploying the latest docs
=========================

NOTE: These instructions assume that your workspace has all the mynewt repos
cloned under the same parent sub directory. 

#. Ensure that all changes are merged into ``master`` and that the ``master``
branch is checked out.
#. Repeat for any mynewt code repo that has documentation changes.
#. Follow the steps at `Site Docs`_ to release the docs.

Creating a versioned set of docs
================================

When the master/latest documentation is deemed representative of a Mynewt
version, it is time to create a versioned set.

#. Make sure all your mynewt-* repos are up to date and that all changes are
merged and committed.
#. Add the new version to mynewt-documentation/docs/themes/mynewt/versions.html
  * Also add the new version to any existing archived set.
  * i.e ``mynewt-documentation/versions/*/mynewt-documentation/docs/themes/mynewt/versions.html``
  * Make sure the 'selected' flag is correct for the archived version
#. Make a versions/vX_Y_Z directory
#. Copy mynewt-documentation/* (except versions!) into versions/vX_Y_Z/mynewt-documentation
#. Copy the mynewt-core repo into versions/vX_Y_Z/mynewt-core
#. Repeat for other mynewt-* repos with doxygen docs and a /docs folder
#. Update the version fields in
  * ``docs/conf.py``
  * and ``versions/vX_Y_Z/mynewt-documentation/docs/conf.py``
#. Add a warning that this is not the most recent documentation to:
  * mynewt-documentation/versions/vX_Y_Z/mynewt-documentation/docs/themes/mynewt/layout.html
  * see an existing older version for example

To preview the changes:

.. code-block:: bash

  cd mynewt-documentation/versions/vX_Y_Z/mynewt-documentation
  make clean && make docs && (cd _build/html && python -m SimpleHTTPServer 8080)

.. _Apache Mynewt: https://mynewt.apache.org/
.. _Sphinx: http://www.sphinx-doc.org/
.. _Doxygen: http://www.doxygen.org/
.. _Homebrew: http://brew.sh/
.. _Pip: https://pip.readthedocs.io/en/stable/installing/
.. _Breathe: http://breathe.readthedocs.io/en/latest/
.. _Site Docs: https://github.com/apache/mynewt-site#deploying-the-latest-docs
