Step by Step process to get oriented for success with Newt Operating System!

## Getting set up 

1. Get an account on GitHub. Make sure you have joined the "Newt Operating System" organization.

2. Do you have Homebrew? If not, open a terminal and install it. It will ask you for your sudo password.

        $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

3. The environment must be readied for using Go. Go code must be kept inside a workspace. A workspace is a directory hierarchy with three directories at its root:

    * src contains Go source files organized into packages (one package per directory),

    * pkg contains package objects, and

    * bin contains executable commands.

    The GOPATH environment variable specifies the location of your workspace. First create a 'dev' directory and then a 'go' directory under it. Set the GOPATH environment variable to this directory and then proceed to create the directory for cloning the stack tool repository. 

        $ mkdir larva    
        $ cd larva
        $ mkdir go  
        $ cd go  
        $ export GOPATH=`pwd` 

    Note that you need to add export statements to ~/.bash_profile to export variables permanently.            
        $ vi ~/.bash_profile

4. The next step is to set up the package building tool "newt" on your local machine. First create the appropriate directory for it and then clone the newt tool repository from github.com into this newly created directory. Check the installation.

        $ mkdir -p src/github.com/mynewt  
        $ cd src/github.com/mynewt
        $ git clone https://github.com/mynewt/newt.git
        $ ls
        newt
        $ cd newt
        $ ls
        Godeps                  README.md               coding_style.txt        newt.go
        LICENSE                 cli                     design.txt

5. Now you will get the godep package. Return to the go directory level and get godep. Check for it in the bin subdirectory. 

        $ cd ~/larva/go
        $ pwd  
        $HOME/larva/go
        $ go get github.com/tools/godep
        $ ls
        bin     pkg     src
        $ ls bin
        godep

6. Next you will use brew to install go. The summary message at the end of the installation should indicate that it as installed in the /usr/local/Cellar/go/ directory. Use the go command 'install' to compile and install packages and dependencies. In preparation for the install, you may use the godep command 'restore' to check out listed dependency versions in $GOPATH and link all the necessary files. Also set the GOROOT environment variable to /usr/local/Cellar/go as that is the root of the brewed go directory structure. Again, to make the export variable permanent, add it to your ~/.bash_profile and ~./bashrc files.

        $ brew install go
        ==> 
        ==> 
        ==> *Summary*
        🍺  /usr/local/Cellar/go/1.5.1: 5330 files, 273M
        $ cd $GOPATH/src/github.com/mynewt/newt
        $ godep restore
        $ go install
        $ export GOROOT=/usr/local/Cellar/go

    Alternatively, you can download the go package directly from (https://golang.org/dl/) instead of brewing it. Install it in /usr/local directory and set GOROOT to /usr/local/go as that is now the root of the go directory structure.

7. Try using go to run the newt.go program. You will see the compiled binary as 'newt' in the directory. If not, you can compile the packages again by typing 'go build' at the command line. 

    Now try running newt using the compiled binary. For example, check for the version number by typing 'newt version'. See all the possible commands available to a user of newt by typing 'newt -h'.

        $ ls
        Godeps			README.md		coding_style.txt	stack
        LICENSE			cli			design.txt		stack.go
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
       
8. Without creating a project repository you can't do a whole lot with the newt tool. So let's get started on the first project - getting an Olimex board to blink!


