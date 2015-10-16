## Project No. 2
### Porting Project Blinky to a second board

#### Objective

The goal of this tutorial is to download a generic skeleton for getting LEDs to blink on any hardware and add additional eggs to generate a build for a specific board.

#### Hardware needed

* Discovery kit with STM32F303VC MCU
* Laptop running Mac OS


#### Step by Step Instructions

* The first step is to download the generic skeleton of the project. The eggs installed are not hardware architecture specific.

        [user:~/foo]$ newt nest create test_project
        Downloading nest skeleton from https://www.github.com/mynewt/tadpole...   ok!
        Nest test_project successfully created in /Users/marko/foo/test_project
    
        [user:~/foo]$ cd test_project/

* Then, the clutch of eggs named larva is added from the nest (also named larva) on the github. This step simply downloads the clutch description file and does not actually install the eggs that constitute the clutch. The clutch description file (`clutch.yml`) will be used to check dependencies during the egg install to ensure completeness. It serves as a reference for all the eggs in the clutch that one can choose from and install.
 
        [user:~/foo/test_project]$ newt nest add-clutch larva https://github.com/mynewt/larva
        Downloading clutch.yml from https://github.com/mynewt/larva/master... ok!
        Verifying clutch.yml format... ok!
        Clutch larva successfully installed to Nest.

* The next step is to install relevant eggs from the larva nest on github. The instructions assume that you know what application or project you are interested in (the blinky application, in this case), what hardware you are using (STM32F3DISCOVERY board, in this case) and hence, what board support package you need. 

        [user:~/foo/test_projec]$ newt egg install project/blinky          
        Downloading larva from https://github.com/mynewt/larva//master... ok!
        Installing project/blinky
        Installation was a success!
    
        [user:~/foo/test_project]$ newt egg install hw/bsp/stm32f3discovery
        Downloading larva from https://github.com/mynewt/larva//master... ok!
        Installing hw/bsp/stm32f3discovery
        Installing hw/mcu/stm/stm32f3xx
        Installing libs/cmsis-core
        Installing compiler/arm-none-eabi-m4
        Installation was a success!


* It's time to create a target for the project and define the target attributes. 

        [user:~/foo/test_project]$ newt target create blink_f3disc
        Creating target blink_f3disc
        Target blink_f3disc successfully created!

        [user:~/foo/test_project]$ newt target set blink_f3disc project=blinky
        Target blink_f3disc successfully set project to blinky

        [user:~/foo/test_project]$ newt target set blink_f3disc bsp=hw/bsp/stm32f3discovery
        Target blink_f3disc successfully set bsp to hw/bsp/stm32f3discovery

        [marko@Markos-MacBook-Pro-2:~/foo/test_project]$ newt target set blink_f3disc compiler_def=debug
        Target blink_f3disc successfully set compiler_def to debug

        [user:~/foo/test_project]$ newt target set blink_f3disc compiler=arm-none-eabi-m4
        Target blink_f3disc successfully set compiler to arm-none-eabi-m4
        
        [user:~/foo/test_project]$ newt target set blink_f3disc arch=cortex_m4
        Target blink_f3disc successfully set arch to cortex_m4
        
        [user:~/foo/test_project]$ newt target show blink_f3disc
        blink_f3disc
	        arch: cortex_m4
	        project: blinky
	        bsp: hw/bsp/stm32f3discovery
	        compiler_def: debug
	        compiler: arm-none-eabi-m4
	        name: blink_f3disc
        
* Finally, you get to build the target and generate an executable that can now be uploaded to the board via the JTAG port. You can go into the openocd directory and start an OCD session as you did in Project 1.
        
        [user:~/foo/test_project]$ newt target build         blink_f3disc
        Building target blink_f3disc (project = blinky)
        Compiling case.c
        Compiling suite.c
        Compiling testutil.c
        Compiling testutil_arch_arm.c
        Archiving libtestutil.a
        Compiling os.c
        Compiling os_callout.c
        Compiling os_eventq.c
        Compiling os_heap.c
        Compiling os_mbuf.c
        Compiling os_mempool.c
        Compiling os_mutex.c
        Compiling os_sanity.c
        Compiling os_sched.c
        Compiling os_sem.c
        Compiling os_task.c
        Compiling os_time.c
        Compiling os_arch_arm.c
        Assembling HAL_CM4.s
        Assembling SVC_Table.s
        Archiving libos.a
        Compiling hal_gpio.c
        Compiling stm32f3xx_hal_gpio.c
        Archiving libstm32f3xx.a
        Compiling cmsis_nvic.c
        Compiling libc_stubs.c
        Compiling os_bsp.c
        Compiling sbrk.c
        Compiling system_stm32f3xx.c
        Assembling startup_stm32f303xc.s
        Archiving libstm32f3discovery.a
        Compiling main.c
        Building project blinky
        Linking blinky.elf
        Successfully run!

