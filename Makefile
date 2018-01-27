# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
SPHINXPROJ    = Apache Mynewt
SOURCEDIR     = _scratch
BUILDDIR      = _build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: help Makefile clean docs

docs: _scratch html

_scratch:
	mkdir _scratch
	cp -a docs/* _scratch
	# Copy in docs/ from each of the mynewt-* projects.
	# NOTE: paths here nead to match edit_on_github in conf.py
	# the mynewt-core cp will eventually be
	# cp -a ../mynewt-core/docs/os _scratch/os
	# cp -a ../mynewt-core/docs/network _scratch/network
	# once redundant files are pruned
	mkdir _scratch/os
	cp -a ../mynewt-core/docs/os/*.rst _scratch/os/
	mkdir _scratch/os/core_os
	cp -a ../mynewt-core/docs/os/core_os/porting _scratch/os/core_os/
	#
	cp -a ../mynewt-core/docs/os/core_os/mynewt_os.rst _scratch/os/core_os/mynewt_os.rst
	cp -a ../mynewt-core/docs/os/core_os/API.rst _scratch/os/core_os/API.rst
	mkdir _scratch/os/core_os/context_switch
	cp -a ../mynewt-core/docs/os/core_os/context_switch/context_switch.rst _scratch/os/core_os/context_switch/context_switch.rst
	mkdir _scratch/os/core_os/cputime
	cp -a ../mynewt-core/docs/os/core_os/cputime/os_cputime.rst _scratch/os/core_os/cputime/os_cputime.rst
	#
	mkdir _scratch/os/modules
	cp -a ../mynewt-core/docs/os/modules/console _scratch/os/modules/
	cp -a ../mynewt-core/docs/os/modules/sysinitconfig _scratch/os/modules/
	#
	mkdir _scratch/network
	cp -a ../mynewt-core/docs/network/ble _scratch/network/
	#
	cp -a ../mynewt-newt/docs _scratch/newt
	#
	cp -a ../mynewt-newtmgr/docs _scratch/newtmgr
	#
	doxygen doxygen-mynewt-core.xml

clean:
	rm -rf _build _scratch

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
