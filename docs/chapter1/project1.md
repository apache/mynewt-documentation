## Objective

We will show you how you can use eggs from a nest on Mynewt to make an LED on a target board blink. We will call it ** Project Blink**. The goals of this tutorial are threefold:
 
1. First, you will learn how to set up your environment to be ready to use the various eggs that you will download from Mynewt. 
2. Second, we will walk you through a download of eggs for building and testing [on a simulated target](#anchor3).
3. Third, you will download eggs and use tools to create a runtime image for a board to [make its LED blink](#anchor4). 

If you want to explore even further, you can try to upload the image to the board's flash memory and have it [boot from flash](#anchor5)!

## What you need

1. STM32-E407 development board from Olimex.
2. ARM-USB-TINY-H connector with JTAG interface for debugging ARM microcontrollers (comes with the ribbon cable to hook up to the board)
3. USB A-B type cable to connect the debugger to your personal computer
4. Personal Computer

The instructions assume the user is using a Bourne-compatible shell (e.g. bash or zsh) on your computer. You may already have some of the required packages on your machine.  In that 
case, simply skip the corresponding installation step in the instructions under [Getting your Mac Ready](#anchor1) or [Getting your Ubuntu machine Ready](#anchor2). While the given instructions should work on other versions, they have been tested for the two specific releases of operating systems noted here:

* Mac: OS X Yosemite Version 10.10.5
* Linux: Ubuntu 14.10 (Utopic Unicorn)


## [Getting your Mac Ready](id:anchor1) 

#### Getting an account on GitHub

* Get an account on GitHub. Make sure you have joined the "Newt Operating System" organization.

#### Installing Homebrew to ease installs on OS X 

* Do you have Homebrew? If not, open a terminal on your Mac and paste the following at a Terminal prompt. It will ask you for your sudo password.

        $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    Alternatively, you can just extract (or `git clone`) Homebrew and install it to `/usr/local`.

#### Creating local repository 

* The directory structure must be first readied for using Go. Go code must be kept inside a workspace. A workspace is a directory hierarchy with three directories at its root:

    * src contains Go source files organized into packages (one package per directory),

    * pkg contains package objects, and

    * bin contains executable commands.

    The GOPATH environment variable specifies the location of your workspace. First create a 'dev' directory and then a 'go' directory under it. Set the GOPATH environment variable to this directory and then proceed to create the directory for cloning the newt tool repository.

        $ cd $HOME
        $ mkdir -p dev/go  
        $ cd dev/go
        $ export GOPATH=`pwd`

    Note that you need to add export statements to ~/.bash_profile to export variables permanently.
        $ vi ~/.bash_profile

* The next step is to set up the repository for the package building tool "newt" on your local machine. First create the appropriate directory for it and then clone the newt tool repository from github.com into this newly created directory. Check the installation.

        $ mkdir -p $GOPATH/src/github.com/mynewt  
        $ cd $GOPATH/src/github.com/mynewt
        $ git clone https://github.com/mynewt/newt.git
        $ ls
        newt
        $ cd newt
        $ ls
        Godeps                  README.md               coding_style.txt        newt.go
        LICENSE                 cli                     design.txt

#### Installing Go and Godep

* Next you will use brew to install go. The summary message at the end of the installation should indicate that it as installed in the /usr/local/Cellar/go/ directory. Use the go command 'install' to compile and install packages and dependencies. Also set the GOROOT environment variable to /usr/local/Cellar/go as that is the root of the brewed go directory structure. Again, to make the export variable permanent, add it to your ~/.bash_profile and ~./bashrc files.

        $ brew install go
        ==> 
        ==> 
        ==> *Summary*
        🍺  /usr/local/Cellar/go/1.5.1: 5330 files, 273M
        $ cd $GOPATH/src/github.com/mynewt/newt
        $ export GOROOT=/usr/local/Cellar/go

    Alternatively, you can download the go package directly from (https://golang.org/dl/) instead of brewing it. Install it in /usr/local directory and set GOROOT to /usr/local/go as that is now the root of the go directory structure.

* Now you will get the godep package. Return to the go directory level and get godep. Check for it in the bin subdirectory. Add the go environment to path. Make sure it is added to your .bash_profile.

        $ cd $GOPATH
        $ go get github.com/tools/godep
        $ ls
        bin     pkg     src
        $ ls bin
        godep
        $ export PATH=$PATH:$GOPATH/bin 

* Use the go command 'install' to compile and install packages and dependencies. In preparation for the install, you may use the godep command 'restore' to check out listed dependency versions in $GOPATH and link all the necessary files. Note that you may have to go to the `~/dev/go/src/github.com/mynewt/newt` directory to successfully run the restore command (e.g. on certain distributions of Linux). You may also have to do a `go get` before the restore to make sure all the necessary packages and dependencies are correct.

        $ cd ~/dev/go/src/github.com/mynewt/newt
        $ go get
        $ ~/dev/go/bin/godep restore
        $ go install

#### Building the Newt tool

* You will now use go to run the newt.go program to build the newt tool. After the run you will see the compiled binary as 'newt' in the directory. Now try running newt using the compiled binary. For example, check for the version number by typing 'newt version'. See all the possible commands available to a user of newt by typing 'newt -h'.

Note: If you are going to be be modifying the newt tool itself often and wish to compile the program every time you call it, you may want to store the command in a variable in your .bash_profile. So type in `export newt="go run $GOPATH/src/github.com/mynewt/newt/newt.go"` in your .bash_profile and execute it by calling `$newt` at the prompt instead of `newt`. Don't forget to reload the updated bash profile by typing `source ~/.bash_profile` at the prompt!

        $ go run $GOPATH/src/github.com/mynewt/newt/newt.go
        $ cd ~/dev/go/src/github.com/mynewt/newt
        $ ls
        Godeps			README.md		coding_style.txt	newt
        LICENSE			cli			design.txt		newt.go
        $ newt version
        Newt version:  1.0
        $ newt -h
        Newt allows you to create your own embedded project based on the
		     Newt operating system

        Usage: 
            newt [flags]
            newt [command]

        Available Commands: 
            version     Print the Newt version number
            target      Set and view target information
            repo        Commands to manipulate the base repository
            compiler    Commands to install and create compiler definitions
            pkg         Commands to list and inspect packages on a repo
            help        Help about any command

        Flags:
            -h, --help=false: help for newt
            -l, --loglevel="WARN": Log level, defaults to WARN.


        Use "newt help [command]" for more information about a command.
       
* Without creating a project repository you can't do a whole lot with the Newt tool. So you'll have to wait till you have downloaded a nest to try out the tool. 

#### Getting the debugger ready

* Before you start building nests and hatching eggs, you need to do one final step in the environment preparation - install gcc / libc that can produce 32-bit executables. ARM maintains a pre-built GNU toolchain with a GCC source branch targeted at Embedded ARM Processors namely Cortex-R/Cortex-M processor families. Install the PX4 Toolchain and check the version installed. Make sure that the symbolic link installed by Homebrew points to the correct version of the debugger. If not, you can either change the symbolic link using the "ln -f -s" command or just go ahead and try with the version it points to!

        $ brew tap PX4/homebrew-px4
        $ brew update
        $ brew install gcc-arm-none-eabi-49
        $ arm-none-eabi-gcc --version  
        arm-none-eabi-gcc (GNU Tools for ARM Embedded Processors) 4.9.3 20150529 (release) [ARM/embedded-4_9-branch revision 224288]
        Copyright (C) 2014 Free Software Foundation, Inc.
        This is free software; see the source for copying conditions.  There is NO
        warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
        $ ls -al /usr/local/bin/arm-none-eabi-gdb
        lrwxr-xr-x  1 aditihilbert  admin  69 Sep 22 17:16 /usr/local/bin/arm-none-eabi-gdb -> /usr/local/Cellar/gcc-arm-none-eabi-49/20150609/bin/arm-none-eabi-gdb

    Note: If no version is specified, brew will install the latest version available. StackOS will eventually work with multiple versions available including the latest releases. However, at present we have tested only with this version and recommend it for getting started. 
    
* You have to install OpenOCD (Open On-Chip Debugger) which is an open-source software that will allow you to interface with the JTAG debug connector/adaptor for the Olimex board. It lets you program, debug, and test embedded target devices which, in this case, is the Olimex board. Use brew to install it. Brew adds a simlink /usr/local/bin/openocd to the openocd directory in the Cellar.

        $ brew install open-ocd
        $ which openocd
        /usr/local/bin/openocd
        $ ls -l $(which openocd)
        lrwxr-xr-x  1 <user>  admin  36 Sep 17 16:22 /usr/local/bin/openocd -> ../Cellar/open-ocd/0.9.0/bin/openocd


## [Getting your Ubuntu machine Ready](id:anchor2) 

#### Getting an account on GitHub

* Get an account on GitHub. Make sure you have joined the "Newt Operating System" organization.

#### Installing some prerequisites

* Install git, libcurl, and the go language if you do not have them already.

        $ sudo apt-get install git 
        $ sudo apt-get install libcurl4-gnutls-dev 
        $ sudo apt-get install golang 
        
#### Creating local repository 

* The directory structure must be first readied for using Go. Go code must be kept inside a workspace. A workspace is a directory hierarchy with three directories at its root:

    * src contains Go source files organized into packages (one package per directory),

    * pkg contains package objects, and

    * bin contains executable commands.

    The GOPATH environment variable specifies the location of your workspace. First create a 'dev' directory and then a 'go' directory under it. Set the GOPATH environment variable to this directory and then proceed to create the directory for cloning the newt tool repository.

        $ cd $HOME
        $ mkdir -p dev/go  
        $ cd dev/go
        $ export GOPATH=$PWD

    Note that you need to add export statements to ~/.bashrc (or equivalent) to export variables permanently.

* Next, install godep. Note that the following command produces no output.

        $ go get github.com/tools/godep 

* Set up the repository for the package building tool "newt" on your local machine. First create the appropriate directory for it and then clone the newt tool repository from github.com into this newly created directory. Check the contents of the directory.

        $ mkdir -p $GOPATH/src/github.com/mynewt  
        $ cd $GOPATH/src/github.com/mynewt
        $ git clone https://github.com/mynewt/newt.git
        $ ls
        newt
        $ cd newt
        $ ls
        Godeps                  README.md               coding_style.txt        newt.go
        LICENSE                 cli                     design.txt

* Use the go command 'install' to compile and install packages and dependencies. Add go environment to path. Again, to make the export variable permanent, add it to your ~/.bashrc (or equivalent) file.

        $ $GOPATH/bin/godep restore 
        $ go get 
        $ go install 
        $ export PATH=$PATH:$GOPATH/bin

#### Building the newt tool

* You will now use go to run the newt.go program to build the newt tool. After the run you will see the compiled binary as 'newt' in the directory. Now try running newt using the compiled binary. For example, check for the version number by typing 'newt version'. See all the possible commands available to a user of newt by typing 'newt -h'.

Note: If you are going to be be modifying the newt tool itself often and wish to compile the program every time you call it, you may want to store the command in a variable in your .bash_profile. So type in `export newt="go run $GOPATH/src/github.com/mynewt/newt/newt.go"` in your ~/.bashrc (or equivalent) and execute it by calling `$newt` at the prompt instead of `newt`. 

        $ go run $GOPATH/src/github.com/mynewt/newt/newt.go
        $ cd ~/dev/go/src/github.com/mynewt/newt
        $ ls
        Godeps			README.md		coding_style.txt	newt
        LICENSE			cli			design.txt		newt.go
        $ newt version
        Newt version:  1.0
        $ newt -h
        Newt allows you to create your own embedded project based on the
		     Newt operating system

        Usage: 
            newt [flags]
            newt [command]

        Available Commands: 
            version     Print the Newt version number
            target      Set and view target information
            repo        Commands to manipulate the base repository
            compiler    Commands to install and create compiler definitions
            pkg         Commands to list and inspect packages on a repo
            help        Help about any command

        Flags:
            -h, --help=false: help for newt
            -l, --loglevel="WARN": Log level, defaults to WARN.


        Use "newt help [command]" for more information about a command.
        
* Without creating a project repository you can't do a whole lot with the Newt tool. So you'll have to wait till you have downloaded a nest to try out the tool. 

#### Getting the debugger ready

* Before you start building nests and hatching eggs, you need to do one final step in the environment preparation - install gcc / libc that can produce 32-bit executables. You can install these as follows: 

        $ sudo apt-get install gcc-multilib libc6-i386
        
* For the LED project on the Olimex hardware, you have to install gcc for AM 4.9.3.  This package can be installed with apt-get as documented [here](https://launchpad.net/~terry.guo/+archive/ubuntu/gcc-arm-embedded).

        $ sudo apt-get remove binutils-arm-none-eabi gcc-arm-none-eabi 
        $ sudo add-apt-repository ppa:terry.guo/gcc-arm-embedded 
        $ sudo apt-get update 
        $ sudo apt-get install gcc-arm-none-eabi

* And finally, you have to install OpenOCD (Open On-Chip Debugger) which is an open-source software that will allow you to interface with the JTAG debug connector/adaptor for the Olimex board. It lets you program, debug, and test embedded target devices which, in this case, is the Olimex board. You have to acquire OpenOCD 0.8.0. 

    If you are running Ubuntu 15.x, then you are in luck and you can simply run: 

        $ sudo apt-get install openocd 

    Other versions of Ubuntu may not have the correct version of openocd available.  In this case, you should download the openocd 0.8.0 package from [https://launchpad.net/ubuntu/vivid/+source/openocd](https://launchpad.net/ubuntu/vivid/+source/openocd). The direct link to the amd64 build is [http://launchpadlibrarian.net/188260097/openocd_0.8.0-4_amd64.deb](http://launchpadlibrarian.net/188260097/openocd_0.8.0-4_amd64.deb). 



## [Building test code on simulator](id:anchor3)

1.  First, you have to create a repository for the project i.e. build your first nest! Go to ~/dev and clone the larva repository from github. The URL used below is the HTTPS clone URL from the github.com repository for the Newt Operating System.

        $ cd ~/dev 
        $ git clone https://github.com/mynewt/larva.git
        $ ls
        go	larva
        $ cd larva
        $ ls
        LICENSE			hw			project
        README.md		libs			repo.yml
        compiler		pkg			setup-remotes.sh

2. You will now create a new project using the newt tool. You can either use the compiled binary `newt` or run the newt.go program using `$newt` (assuming you have stored the command in a variable in your .bash_profile or .bashrc). When you do a `newt target show` or `$newt target show` it should list all the projects you have created so far. 

        $ $newt target create sim_test
        Creating target sim_test
        Target sim_test sucessfully created!
        $ $newt target show
        sim_test
	        name: sim_test
	        arch: sim

3. Now continue to populate and build out the sim project.

        $ $newt target set sim_test project=test
        Target sim_test successfully set project to test
        $ $newt target set sim_test compiler_def=debug
        Target sim_test successfully set compiler_def to debug
        $ $newt target set sim_test bsp=hw/bsp/native
        Target sim_test successfully set bsp to hw/bsp/native
        $ $newt target set sim_test compiler=sim
        Target sim_test successfully set compiler to sim
        $ $newt target show sim_test
        sim_test
	        arch: sim
	        project: test
	        compiler_def: debug
	        bsp: hw/bsp/native
	        compiler: sim
	        name: sim_test

4. Configure newt to use the gnu build tools native to linux.  Replace 
~/dev/larva/compiler/sim/compiler.yml with the linux-compiler.yml file: 

        $ cp compiler/sim/linux-compiler.yml compiler/sim/compiler.yml

5. Next, create (hatch!) the eggs for this project using the newt tool - basically, build the packages for it. You can specify the VERBOSE option if you want to see the gory details. 

        $ $newt target build sim_test
        Successfully run!

    You can specify the VERBOSE option if you want to see the gory details.

        $newt -l VERBOSE target build sim_test
        2015/09/29 09:46:12 [INFO] Building project test
        2015/09/29 09:46:12 [INFO] Loading Package /Users/aditihilbert/dev/larva/libs//bootutil...
        2015/09/29 09:46:12 [INFO] Loading Package /Users/aditihilbert/dev/larva/libs//cmsis-core...
        2015/09/29 09:46:12 [INFO] Loading Package /Users/aditihilbert/dev/larva/libs//ffs..
        ...
        Successfully run!

6. Try running the test suite executable inside this project and enjoy your first successful hatch.

        $ ./project/test/bin/sim_test/test.elf
        [pass] os_mempool_test_suite/os_mempool_test_case
        [pass] os_mutex_test_suite/os_mutex_test_basic
        [pass] os_mutex_test_suite/os_mutex_test_case_1
        [pass] os_mutex_test_suite/os_mutex_test_case_2
        [pass] os_sem_test_suite/os_sem_test_basic
        [pass] os_sem_test_suite/os_sem_test_case_1
        [pass] os_sem_test_suite/os_sem_test_case_2
        [pass] os_sem_test_suite/os_sem_test_case_3
        [pass] os_sem_test_suite/os_sem_test_case_4
        [pass] os_mbuf_test_suite/os_mbuf_test_case_1
        [pass] os_mbuf_test_suite/os_mbuf_test_case_2
        [pass] os_mbuf_test_suite/os_mbuf_test_case_3
        [pass] gen_1_1/ffs_test_unlink
        [pass] gen_1_1/ffs_test_rename
        [pass] gen_1_1/ffs_test_truncate
        [pass] gen_1_1/ffs_test_append
        [pass] gen_1_1/ffs_test_read
        [pass] gen_1_1/ffs_test_overwrite_one
        [pass] gen_1_1/ffs_test_overwrite_two
        [pass] gen_1_1/ffs_test_overwrite_three
        ...
        ...
        [pass] boot_test_main/boot_test_vb_ns_11


## [Making an LED blink](id:anchor4)

#### Preparing the Software

1. Make sure the PATH environment variable includes the $HOME/dev/go/bin directory.

2. Again, you first have to create a repository for the project. Go to the ~dev/larva directory and build out a second project inside larva. The project name is "blink", in keeping with the objective. Starting with the target name, you have to specify the different aspects of the project to build the right package for the board. In this case that means setting the architecture (arch), compiler, board support package (bsp), project, and compiler mode.

        $ newt target create blink
        Creating target blink
        Target blink sucessfully created!
        $ newt target set blink arch=cortex_m4
        Target blink successfully set arch to arm
        $ newt target set blink compiler=arm-none-eabi-m4
        Target blink successfully set compiler to arm-none-eabi-m4
        $ newt target set blink project=main
        Target blink successfully set project to main
        $ newt target set blink compiler_def=debug
        Target blink successfully set compiler_def to debug
        $ newt target set blink bsp=hw/bsp/olimex_stm32-e407_devboard
        Target blink successfully set bsp to hw/bsp/olimex_stm32-e407_devboard
        $ newt target show blink
        blink
	        compiler: arm-none-eabi-m4
	        project: main
	        compiler_def: debug
	        bsp: hw/bsp/olimex_stm32-e407_devboard
	        name: blink
	        arch: cortex_m4

3. Now you have to build the image package. Once built, you can find the executable "main.elf" in the project directory at ~/dev/larva/project/main/bin/blink. It's a good idea to take a little time to understand the directory structure.

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


4. Check that you have all the scripts needed to get OpenOCD up and talking with the project's specific hardware. Check whether you already have the scripts in your `/usr/share/openocd/scripts/ ` directory. If yes, you are all set and can proceed to preparing the hardware. If not, continue with this step.

    Currently, the following 5 files are required. They are likely to be packed into a .tar file and made available under mynewt on github.com. Unpack it in the blink directory using `tar xvfz` command. Go into the openocd directory created and make sure that the gdb-8888.cfg file indicates the correct file (main.elf) to load and its full path. Specifically, look for 'load ~/dev/larva/project/main/bin/blink/main.elf' and 'symbol-file ~/larva/larva/project/main/bin/blink/main.elf'.   

    * ocd-8888.cfg
    * olimex-arm-usb-tiny-h-ftdi.cfg
    * arm-gdb.cfg
    * gdb-dev_test-8888.cfg
    * stm32f4x.cfg  
    
    Check the arm-gdb.cfg file and see whether the executable you created in the previous step is specified as the file to be loaded to the board. You have the choice of specifying the target and load from within the gdb debugger (Section "Let's Go", Step 2) instead.
    
        $ cat gdb-8888.cfg
        echo \n*** Set target charset ASCII\n
        set target-charset ASCII
        #set arm fallback-mode arm
        #echo \n*** set arm fallback-mode arm ***\n
        echo \n*** Connecting to OpenOCD over port #8888 ***\n
        target remote localhost:8888
        echo \n*** loading nic.out.elf ***\n
        load ~/dev/larva/project/main/bin/blink/main.elf
        symbol-file ~/dev/larva/project/main/bin/blink/main.elf 
        #echo *** Set breakpoint and run to main() to sync with gdb ***\n
        #b main
        #continue
        #delete 1

        #set arm fallback-mode thumb
        #echo \n*** set arm fallback-mode thumb ***\n\n


    Note that an OpenOCD configuration script is available from Olimex for the STM32-E407 development board e.g. at [https://www.olimex.com/Products/ARM/ST/STM32-E407/resources/stm32f4x.cfg](https://www.olimex.com/Products/ARM/ST/STM32-E407/resources/stm32f4x.cfg), however getting it to work with different versions of OpenOCD and gcc could get tricky. [<span style="color:red">*This will be simplified eventually into a consolidated single action step instead of manual tweaks currently required*</span>]


#### Preparing the hardware to boot from embedded SRAM

1. Locate the boot jumpers on the board.
![Alt Layout - Top View](./pics/topview.png)
![Alt Layout - Bottom View](./pics/bottomview.png)

2. B1_1/B1_0 and B0_1/B0_0 are PTH jumpers which can be moved relatively easy. Note that the markings on the board may not always be accurate. Always refer to the manual for the correct positioning of jumpers in case of doubt. The two jumpers must always be moved together – they are responsible for the boot mode if bootloader is present. The board can search for bootloader on three places – User Flash Memory, System Memory or the Embedded SRAM. We will configure it to boot from SRAM by jumpering B0_1 and B1_1.

3. Connect USB-OTG#2 in the picture above to a USB port on your computer (or a powered USB hub to make sure there is enough power available to the board). 

4. Connect the JTAG connector to the SWD/JTAG interface on the board. The other end of the cable should be connected to the USB port or hub of your computer.

5. The red PWR LED should be lit. 

#### Let's Go!

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
        
    If your scripts are in `/usr/share/openocd/scripts/ ` directory, type in
    
        $ openocd -f /usr/share/openocd/scripts/interface/ftdi/olimex-arm-usb-tiny-h.cfg -f /usr/share/openocd/scripts/target/stm32f4x.cfg -c "gdb_port 8888; init; reset halt" 

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

3. From within gdb check the registers. Set any registers that may not be as expected (see Step 1 in this section). The setting of the MSP register for the main stack pointer to the expected value is shown here as an example. 
    
    Finally, hit `c` to continue... and your green LED should blink!

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
         (gdb) set $msp=0x10010000
         (gdb) c
         Continuing.

## [Using flash to make LED blink](id:anchor5)

1. Configure the board to boot from flash by moving the two jumpers together to B0_0 and B1_0. 

   You will have to reset the board once the image is uploaded to it.
        
2. By now you know that you have to build a new package. First, the olimex_stm32-e407_devboard.ld linker script which was previously the same as run_from_sram.ld will now need the contents of run_from_flash.ld. Then the target has to be rebuilt. You will simply replace the blink project contents with the eggs needed to boot from flash instead of creating a new nest.

        $ cd ~/dev/larva/hw/bsp/olimex_stm32-e407_devboard
        $ diff olimex_stm32-e407_devboard.ld run_from_sram.ld
        $ cp run_from_flash.ld olimex_stm32-e407_devboard.ld
        $ cd ~/dev/larva/project/main/bin/blink
        $ newt target build blink
        
        
2. You will create a binary image file to upload into flash. 

        $ /usr/local/bin/arm-none-eabi-objcopy -R .bss -R .shared -O binary ~/dev/larva/project/main/bin/blink/main.elf ~/dev/larva/project/main/bin/blink/main.bin
        $ ls
        main.bin		main.elf.lst		openocd
        main.elf		main.elf.map		openocd-pkg.tar.gz
        
3. Go to the openocd directory under blink and use OpenOCD to open up a session with the board as done while booting from SRAM.

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
        target state: halted
        target halted due to debug-request, current mode: Thread 
        xPSR: 0x01000000 pc: 0x0800408c psp: 0x20003c60
        Info : JTAG tap: stm32f4x.cpu tap/device found: 0x4ba00477 (mfg: 0x23b, part: 0xba00, ver: 0x4)
        Info : JTAG tap: stm32f4x.bs tap/device found: 0x06413041 (mfg: 0x020, part: 0x6413, ver: 0x0)
        target state: halted
        target halted due to debug-request, current mode: Thread 
        xPSR: 0x01000000 pc: 0x08000580 msp: 0x10010000

4. Run the GNU debugger for ARM in a different window. Specifying the script gdb-8888.cfg tells it what image to load. You should now have a (gdb) prompt inside the debugger.

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
        
5. From within gdb check the registers. Set any registers that may not be as expected. Finally, hit `c` to continue... and your green LED should blink!

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
         (gdb) set $msp=0x10010000
         (gdb) c
         Continuing.



