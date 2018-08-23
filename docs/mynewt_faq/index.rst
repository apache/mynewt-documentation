Mynewt FAQ
==========

Welcome to the Mynewt FAQ. Here are some commonly asked questions asked about the Mynewt OS, separated by categories. 

.. toctree::
   :maxdepth: 1

   Administrative <faq_admin>
   Bluetooth <faq_bluetooth>
   Bootloader and Firmware Upgrade <faq_boot>
   Drivers and Modules <faq_modules>
   File System <faq_fs>
   Hardware-Specific <faq_hardware>
   Mynewt Syntax and Semantics <faq_mynewt>
   NFC <faq_nfc>
   Newt <faq_newt>
   Newt Manager <faq_newtmgr>
   Porting Mynewt <faq_port>
   Troubleshooting <faq_troubleshoot>

General FAQs
------------

- Make sure to update to the latest available version to ensure everything remains functional. There may be some changes that break backwards compatibility or change how certain features work, so be sure to always update.
- If you are making changes to code, adding new features, etc., please update to the latest branch to ensure that any changes you make work with the newest changes and features in Mynewt.

Reduce Code Size for Mynewt Image
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Q**: How do I reduce the code size for my Mynewt image?

**A**: Please refer to the tutorial documentation on :doc:`reducing application code size <../../tutorials/other/codesize>`.

``compiler.yml`` vs. ``pkg.yml``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Q**: What's the difference between ``compiler.yml`` and ``pkg.yml``?

**A**: ``compiler.yml`` defines a compiler. ``pkg.yml`` contains metadata about the package. All packages have a 
``pkg.yml`` file, even compiler packages.

Version Control Applications with Git 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Q**: What's the recommended way to work with git when you want to version control your application? As ``apache-mynewt-core`` is already a repository, there is a repo in repo problem. Are there any good alternatives/tools to submodules, mirror, etc? Ideally, I want to version control everything from the top level project directory as well as upgrading apache-mynewt-core, pushing pull requests back to Mynewt if needed, etc.

**A**: You can simply have a separate git for your app. For example, if you followed the Blinky tutorial, your git would be in ``apps/foo``, while repos gits are in repos. You may also keep your app in the core repo, just have your own working branch for it. 

Another option is to have your git repository with local packages (including apps) and have ``repository.yml`` there so ``newt install`` can download all dependencies. Just make sure to put e.g. ``bin``, ``repos``, and ``project.state``, and others in ``.gitignore`` so they are not in version control. 

