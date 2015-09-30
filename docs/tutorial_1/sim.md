## Objective

The goal is to create a simulator or 'sim_test' project that can eventually be used for development and testing purposes. 

## Procedure

1. Go to your larva directory and create a new project using the newt tool. You can either use the compiled binary `newt` or run the newt.go program using `$newt` (assuming you have stored the command in a variable in your .bash_profile). When you do a `newt target show` or `$newt target show` it should list all the projects you have created so far. 

        $ cd dev/larva
        $ ls
        LICENSE		compiler	libs		project		scripts
        README.md	hw		manifest.yml	repo.yml
        $ $newt target create sim_test
        Creating target sim_test
        Target sim_test sucessfully created!
        $ $newt target show
        blink
	        name: blink
	        arch: arm
	        compiler: arm-none-eabi-m4
	        project: main
	        compiler_def: debug
	        bsp: hw/bsp/olimex_stm32-e407_devboard
        sim_test
	        name: sim_test
	        arch: sim

2. Now populate and build out the sim project.

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

3. Next, build the packages for this project. You can specify the VERBOSE option if you want to see the gory details. 

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

4. Try running the test suite executable inside this project.  

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

