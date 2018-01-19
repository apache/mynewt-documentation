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


.. _Apache Mynewt: https://mynewt.apache.org/
.. _Sphinx: http://www.sphinx-doc.org/
.. _Doxygen: http://www.doxygen.org/
.. _Homebrew: http://brew.sh/
.. _Pip: https://pip.readthedocs.io/en/stable/installing/
.. _Breathe: http://breathe.readthedocs.io/en/latest/
