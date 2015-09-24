# What is Newt Operating System?

NewtOS is an open-source RTOS (Real Time Operating System) that can be easily customized for your project using the Newt Tool. Like wine, it only gets better with age.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # Introduction - The documentation homepage, overview - this page
        setup/
             newt-dev.md  # Getting started to work on the StackOS or the Stack Tool
             blink.md  # How to test your setup and get your first LED blinking
        user-guide/
             stack-os.md  # How to use or modify StackOS
             stack-tool.md  # How to use Stack Tool
             stack-fs.md  # File System documentation
             stack-ble.md  # BLW documentation

## Why StackOS (Diode)?

An RTOS is typically used in microcontroller applications that use many interrupt sources, functions, and standard communications interfaces. A custom RTOS is optimized to a particular microcontroller resulting in high efficiencies of performance. However, the cost and complexity of building a custom RTOS is very high. StackOS allows you the luxury of a custom RTOS by allowing you to choose RTOS components tuned to your hardware from its rich repository of libraries and giving you an easy-to-use tool to build the package of your choice. Most importantly, StackOS uses open source code base that only gains robustness and wider applicability through community-based modificationsas its use increases.   

## Stack (Diode?) Tool

The Stack Tool helps you build the specific StackOS packages (image binaries) for the combination of hardware and low-level embedded architecture features of your choice. It provides you the infrastructure to manage and build for different CPU architectures, memory units, board support packages etc., allowing you to formulate the contents according to the low-level features needed by your project. It uses Godep which is a more generic package building tool.

If you want to modify the tool itself you should setup your environment as explained in the pull-down Setup -> Stack Tool Developer. Otherwise follow the simple instructions under Setup -> Stack Tool User to prepare your environment.

## Documentation


## Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs help` - Supposed to print this help message but does not work...yet.





