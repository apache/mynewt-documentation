## Objective

## Terminology

Here's a list of terms you should familiarize yourself with to get started.

## Vision

We want to make it very simple for an application developer to develop and release application programs on an embedded device of their choice.We offer a complete suite of open-source software ranging from an operating system to network protocol stacks to allow the application developer to pick and choose the hardware component and easily build a software platform for it with desired features and performance. The application programmer can then design and run their application on the platform in an optimized way. We invite you to join us in our efforts to develop the ecosystem of firmware, software, and tools needed to offer the higher level of abstraction to the application developers to enable them to be more productive and to decrease the time to market their application on the chosen embedded devices.

## What are the basic components being worked on in this ecosystem?

* NewtOS is an open-source RTOS (Real Time Operating System) that is not tied to any particular hardware but can be tuned to the hardware component mix of the user's choosing. It has support for multitasking, synchronization of tasks, scheduling and buffering of operations, memory management,file systems, networking, security, power management, and other advanced features. Naturally, it involves several packages such as the Core RTOS, a flash file system, utility functions, a variety of board support packages, packages of microcontrollers etc.

* Newt Tool helps you mix the specific packages for the combination of hardware and low-level embedded architecture features of the user's choice and generate the corresponding run-time image based on the NewtOS. It provides the infrastructure to manage and build for different CPU architectures, memory units, board support packages etc., allowing a user to formulate the contents according to the low-level features needed by his or her project.

* Network protocol stacks such as Bluetooth Low Energy and more

## Ecosystem terminology

In the mynewt lifecycle, a project grows in a nest. A nest may house multiple projects. The nest is, therefore, a repository where various component packages for one or more projects reside. Each package is an egg, naturally. However, an egg may consist of other eggs!

A nest can be given any name. You will see a nest named "tadpole" in mynewt. It contains all the core libraries of the operating system for distribution. Each of these directories contain one or more eggs where an egg is a basic unit of implementation of any aspect of the RTOS.

* libs/os: The core RTOS which ports to all supported chip platforms.
* hw/hal: The hardware abstraction layer (HAL) API definitions that all BSP and MCU implementations must support
* hw/mcu/native: A MCU implementation for the native platform
* hw/bsp/native: A BSP implementation for the native platform
* compiler/native: The definition of compiler support for the native platform.

Each of the above directories contain one or more eggs where an egg is a basic unit of implementation of any aspect of the RTOS. For example, the libs/os directory holds eggs such as the bootloader, flash file system, the kernel for process/thread/memory management, tools for testing etc. The hw/hal directory holds an egg that provides abstraction for physical hardware components such as GPIO (general purpose input/output), network adapters, timers, and universal asynchronous receiver-transmitters (UARTs). All these physical interfaces are defined in various header files in hw/hal, and are designed to make device driver specification simpler.

You can see another nest in the mynewt ecosystem called the "larva". It was spawned from the "tadpole" nest using the newt tool. Spawning is easy - ` $ newt create nest <your_nest_name> `. "larva" is the developer's test repository containing all sorts of eggs being incubated, including ones to enhance the core operating system which should eventually make their way into the "tadpole" nest. There is a `hatch_tadpole` script to update the "tadpole" nest when the core OS related eggs in "larva" are ready.

There is a third nest named "newt" that contains all the eggs needed to support the build and release process of mynewt software.

There will also be pre-built nests for certain common hardware devices to enable a user to quickly get started with a project.

## What a contributor to the ecosystem needs to know

You can choose to work on any area(s) of the RTOS that you wish to in any way you feel comfortable with. Hence, you can work on one or more eggs or an entire nest. You can create your own nest (master) or create a branch in an existing nest. For now, Runtime contributors will review any new areas of support that you may wish to introduce e.g. a new board support package (BSP) or a new network protocol.

## How an application developer would use our ecosystem

An application developer who is interested only in using software available in this ecosystem to build a top level build artifact may either:

* Use a pre-built nest, or
* Spawn a new nest using the newt tool for a target where a target is a custom combination of supported hardware components

In either case, the user would use the newt tool to create and set the target in the chosen nest. The newt tool would then be used to build out the target profile which would determine which eggs to choose. Finally, the user would use the newt tool to generate a run-time image that can be run on the device.
