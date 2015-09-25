## Objective

The goal is to set up a STM32-E407 development board from Olimex, download an appropriate firmware image onto it, and make the LED on the board blink. First, we will run the image from SRAM. Then, we'll try running the image from flash.

## What you need

1. STM32-E407 development board from Olimex.
2. ARM-USB-TINY-H connector with JTAG interface for debugging ARM microcontrollers (comes with the ribbon cable to hook up to the board)
3. USB A-B type cable to connect the debugger to your personal computer


## Preparing the software package

1. Make sure the PATH environment variable includes the ~$HOME/dev/go/bin directory.

2. ARM maintains a pre-built GNU toolchain with a GCC source branch targeted at Embedded ARM Processors namely Cortex-R/Cortex-M processor families. Install the PX4 Toolchain and check the version installed. Make sure that the symbolic link installed by Homebrew points to the correct version of the debugger. If not, you can either change the symbolic link using the "ln -f -s" command or just go ahead and try with the version it points to!

        $ brew tap PX4/homebrew-px4
        $ brew update
        $ brew install gcc-arm-none-eabi-49
        $ arm-none-eabi-gcc --version  
        arm-none-eabi-gcc (GNU Tools for ARM Embedded Processors) 4.8.4 20140725 (release) [ARM/embedded-4_8-branch revision 213147]
        Copyright (C) 2013 Free Software Foundation, Inc.
        This is free software; see the source for copying conditions.  There is NO
        warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
        $ ls -al /usr/local/bin/arm-none-eabi-gdb
        lrwxr-xr-x  1 aditihilbert  admin  69 Sep 22 17:16 /usr/local/bin/arm-none-eabi-gdb -> /usr/local/Cellar/gcc-arm-none-eabi-49/20150609/bin/arm-none-eabi-gdb

    Note: If no version is specified, brew will install the latest version available. StackOS will eventually work with multiple versions available including the latest releases. However, at present we have tested only with this version and recommend it for getting started. 

3. We now have to create a repository for the project. Go to ~/dev and clone the larva repository from github. The URL used below is the HTTPS clone URL from the github.com repository for the Newt Operating System.

        $ git clone https://github.com/mynewt/larva.git
        $ ls
        go	larva
        $ cd larva
        $ ls
        LICENSE			hw			project
        README.md		libs			repo.yml
        compiler		pkg			setup-remotes.sh
        
4. Next you want to populate and build out the project inside larva. Since you are trying to make the Olimex board blink, the project name is "blink". Starting with the target name, you now have to specify the different aspects of the project to build the right package for the board. In this case that means setting the architecture (arch), compiler, board support package (bsp), project, and compiler mode.

        $ newt target create blink
        Creating target blink
        Target blink sucessfully created!
        $ newt target set blink arch=arm
        Target blink successfully set arch to arm
        $ newt target set blink compiler=arm-none-eabi-m4
        Target blink successfully set compiler to arm-none-eabi-m4
        $ newt target set blink project=main
        Target blink successfully set project to main
        $ newt target set blink compiler_def=debug
        Target blink successfully set compiler_def to debug
        $ newt target set blink bsp=hw/bsp/olimex_stm32-e407_devboard
        Target blink successfully set bsp to hw/bsp/olimex_stm32-e407_devboard
        $ newt target show
        blink
	        compiler: arm-none-eabi-m4
	        project: main
	        compiler_def: debug
	        bsp: hw/bsp/olimex_stm32-e407_devboard
	        name: blink
	        arch: arm

5. Now you have to build the image package. Once built, you can find the executable "main.elf" in the project directory at ~/dev/larva/project/main/bin/blink. It's a good idea to take a little time to understand the directory structure.

        $ newt target build blink
        Successfully run!
        $ ls
        LICENSE			hw			project
        README.md		libs			repo.yml
        compiler		pkg			setup-remotes.sh
        $ cd project
        $ ls
        bin2img		boot		ffs2native	main		test
        $ cd main
        $ ls
        bin		main.yml	src
        $ cd bin
        $ ls
        blink
        $ cd blink
        $ ls
        main.elf	main.elf.lst	main.elf.map
            p flair
6. Now it's time to install OpenOCD or Open On-Chip Debugger (OpenOCD) to allow programming, debugging, and testing of embedded target devices which, in this case, is the Olimex board. Use brew to install it. Brew adds a simlink /usr/local/bin/openocd to the openocd directory in the Cellar.

        $ brew install open-ocd
        $ which openocd
        /usr/local/bin/openocd
        $ ls -l $(which openocd)
        lrwxr-xr-x  1 <user>  admin  36 Sep 17 16:22 /usr/local/bin/openocd -> ../Cellar/open-ocd/0.9.0/bin/openocd

7. Next are the steps to get the debugger up and running with the project's hardware. [<span style="color:red">*This will be simplified eventually into a consolidated single action step instead of manual tweakscurrently required*</span>]

    Currently, the following 5 files are required. They are likely to be packed into a .tar file and made available under mynewt on github.com. Unpack it in the blink directory using `tar xvfz` command. Go into the openocd directory created and make sure that the gdb-8888.cfg file indicates the correct file (main.elf) to load and its full path. Specifically, look for 'load ~/dev/larva/project/main/bin/blink/main.elf' and 'symbol-file ~/larva/larva/project/main/bin/blink/main.elf'.   

    * ocd-8888.cfg
    * olimex-arm-usb-tiny-h-ftdi.cfg
    * arm-gdb.cfg
    * gdb-dev_test-8888.cfg
    * stm32f4x.cfg  

    Now it's time to set up the hardware.  

## Preparing the hardware to boot from embedded SRAM

1. Locate the boot jumpers on the board.
![Alt Layout - Top View](./topview.png)
![Alt Layout - Bottom View](./bottomview.png)

2. B1_1/B1_0 and B0_1/B0_0 are PTH jumpers which can be moved relatively easy. Note that the markings on the board may not always be accurate. Always refer to the manual for the correct positioning of jumpers in case of doubt. The two jumpers must always be moved together – they are responsible for the boot mode if bootloader is present. The board can search for bootloader on three places – User Flash Memory, System Memory or the Embedded SRAM. We will configure it to boot from SRAM by jumpering B0_1 and B1_1.

3. Connect USB-OTG#2 in the picture above to a USB port on your computer (or a powered USB hub to make sure there is enough power available to the board). 

4. Connect the JTAG connector to the SWD/JTAG interface on the board. The other end of the cable should be connected to the USB port or hub of your computer.

5. The red PWR LED should be lit. 

## Making the LED blink

1. Go into the openocd directory and start an OCD session. You should see some status messages are shown below. Check the value of the xPSR, pc (program counter), and msp (main service pointer) registers. If they are not as indicated below, you will have to manually set it after you open the gdp tool to load the image on it (next step). Note the `-c "reset halt"` flag that tells it to halt after opening the session. It will now require a manual "continue" command from the GNU debugger in step 3. 

        $ cd ~/dev/larva/project/main/bin/blink/openocd
        $ openocd -f olimex-arm-usb-tiny-h-ftdi.cfg -f ocd-8888.cfg -f stm32f4x.cfg -c "reset halt" 
        Open On-Chip Debugger 0.8.0 (2015-09-22-18:21)
        Licensed under GNU GPL v2
        For bug reports, read
	        http://openocd.sourceforge.net/doc/doxygen/bugs.html
        Info : only one transport option; autoselect 'jtag'
        adapter speed: 1000 kHz
        adapter_nsrst_assert_width: 500
        adapter_nsrst_delay: 100
        jtag_ntrst_delay: 100
        cortex_m reset_config sysresetreq
        Info : clock speed 1000 kHz
        Info : JTAG tap: stm32f4x.cpu tap/device found: 0x4ba00477 (mfg: 0x23b, part: 0xba00, ver: 0x4)
        Info : JTAG tap: stm32f4x.bs tap/device found: 0x06413041 (mfg: 0x020, part: 0x6413, ver: 0x0)
        Info : stm32f4x.cpu: hardware has 6 breakpoints, 4 watchpoints
        Info : JTAG tap: stm32f4x.cpu tap/device found: 0x4ba00477 (mfg: 0x23b, part: 0xba00, ver: 0x4)
        Info : JTAG tap: stm32f4x.bs tap/device found: 0x06413041 (mfg: 0x020, part: 0x6413, ver: 0x0)
        target state: halted
        target halted due to debug-request, current mode: Thread 
        xPSR: 0x01000000 pc: 0x20000580 msp: 0x10010000 

2. Open a new terminal window and run the GNU debugger for ARM. Specifying the script gdb-8888.cfg tells it what image to load. You should now have a (gdb) prompt inside the debugger.

        $ cd ~/dev/larva/project/main/bin/blink/openocd
        $ arm-none-eabi-gdb -x gdb-8888.cfg 
        GNU gdb (GNU Tools for ARM Embedded Processors) 7.8.0.20150604-cvs
        Copyright (C) 2014 Free Software Foundation, Inc.
        License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
        This is free software: you are free to change and redistribute it.
        There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
        and "show warranty" for details.
        This GDB was configured as "--host=x86_64-apple-darwin10 --target=arm-none-eabi".
        Type "show configuration" for configuration details.
        For bug reporting instructions, please see:
        <http://www.gnu.org/software/gdb/bugs/>.
        Find the GDB manual and other documentation resources online at:
        <http://www.gnu.org/software/gdb/documentation/>.
        For help, type "help".
        Type "apropos word" to search for commands related to "word".
         
        *** Set target charset ASCII
         
        *** Connecting to OpenOCD over port #8888 ***
        0x20000580 in ?? ()
         
        *** loading nic.out.elf ***
        Loading section .text, size 0x65d4 lma 0x20000000
        Loading section .ARM.extab, size 0x24 lma 0x200065d4
        Loading section .ARM.exidx, size 0xd8 lma 0x200065f8
        Loading section .data, size 0x8f8 lma 0x200066d0
        Start address 0x20000580, load size 28616
        Transfer rate: 78 KB/sec, 2861 bytes/write.
        (gdb)

3. Check the registers. Set any registers that may not be as expected (see Step 1 in this section). Finally, hit `c` to continue... and your green LED should blink!

        (gdb) info reg all
         r0             0x0	0
         r1             0x0	0
         r2             0x0	0
         r3             0x0	0
         r4             0x0	0
         r5             0x0	0
         r6             0x0	0
         r7             0x0	0
         r8             0x0	0
         r9             0x0	0
         r10            0x0	0
         r11            0x0	0
         r12            0x0	0
         sp             0x10010000	0x10010000
         lr             0xffffffff	-1
         pc             0x20000580	0x20000580 <Reset_Handler>
         xPSR           0x1000000	16777216
         msp            0x10010000	0x10010000
         psp            0x0	0x0
         primask        0x0	0
         basepri        0x0	0
         faultmask      0x0	0
         control        0x0	0
         (gdb) c
         Continuing.

## Preparing the hardware to boot from flash

1. Configure the board to boot from flash by moving the two jumpers together to B0_0 and B1_0. 
2. You will have to reset the board once the image is uploaded to it.

## Making the LED blink again

1. We will create a binary file 


