## Newt tool Reference

### nest

#### Usage: 

    newt nest [command][flags] input1 input2...

Available commands: 

    create          Create a new nest
    generate-clutch Generate a clutch file from the eggs in the current directory
    add-clutch      Add a remote clutch, and put it in the current nest
    list-clutches   List the clutches installed in the current nest
    show-clutch     Show an individual clutch in the current nest


Flags:

    -h, --help=false: help for nest

Global Flags:

    -h, --help=false: help for newt
    -l, --loglevel="WARN": Log level, defaults to WARN.
    -q, --quiet=false: Be quiet; only display error output.
    -s, --silent=false: Be silent; don't output anything.
    -v, --verbose=false: Enable verbose output when executing commands.

Description

Sub-command  | Explanation
-------------| ------------------------
create       | Downloads the skeleton of a nest on your local machine from the optional `input2` nest url, if specified, and creates a new nest directory by the name of `input1`. If `input2` is not specified, then a default skeleton from the `tadpole` nest on Mynewt is downloaded. The command lays out a generic directory structure for the nest you are going to build under it and includes some default eggs in it.
generate-clutch | Takes a snapshot of the eggs in the current local directory and combines them into a clutch by the name of `input1` and with the url of `input2` and generates a standard output of the clutch details that can be redirected to a `.yml` clutch file. Typically the clutch file name is chosen to match the clutch name which means the standard output should be directed to a clutch file named `input1.yml`
add-clutch   | Downloads the clutch of the name `input1` from the master branch of the github repository `input2` into the current nest. A file named `input1.yml` file is added in the `.nest/clutches` subdirectory inside the current local nest. The `.nest/` directory structure is created automatically if it does not exist.
list-clutches | Lists all the clutches present in the current nest, including clutches that may have been added from other nests on github. The output shows all the remote clutch names and the total eggshells in each of the clutches.
show-clutch | Shows information about the clutch that has the name given in the `input1` argument. Output includes the clutch name, url, and all the constituent eggs with their version numbers.

Command-specific flags

Sub-command  | Available flags | Explanation
-------------| ----------------|------------
add-clutch   | -b, --branch="<branch-name>" | Fetches the clutch file with name `input1` from the specified branch at `input1` url of the github repository. All subsequent egg installations will be done from that branch.

Examples

Sub-command  | Usage                  | Explanation
-------------| -----------------------|-----------------
create       | newt nest create test_project | Creates a new nest named "test_project " using the default skeleton0
create       | newt nest create mynest <nest-url> | Creates a new nest named "mynest" using the skeleton at the <nest-url> specified
generate-clutch | newt nest generate-clutch myclutch https://www.github.com/mynewt/larva > myclutch.yml| Takes a snapshot of the eggs in the current nest to form a clutch named myclutch with the url https://www.github.com/mynewt/larva. The output is written to a file named `myclutch.yml` and describes the properties and contents of the clutch (name, url, eggs).
add-clutch   | newt nest add-clutch larva https://www.github.com/mynewt/larva | Adds the remote clutch named larva at www.github.com/mynewt/larva to the local nest. 
list-clutches | newt nest list-clutches | Shows all the remote clutch description files that been downloaded into the current nest
show-clutch   | newt nest show-clutch larva | Outputs the details of the clutch named larva such as the github url where the remote sits, the constituent eggs and their versions


### egg

#### Usage: 

    newt egg [command][flag] input1 input2
    
    
Available Commands: 
 
    list        List eggs in the current nest
    checkdeps   Check egg dependencies
    hunt        Search for egg from clutches
    show        Show the contents of an egg.
    install     Install an egg
    remove      Remove an egg

Flags:
 
    -h, --help=false: help for egg

Global Flags:

    -l, --loglevel="WARN": Log level, defaults to WARN.
    -q, --quiet=false: Be quiet; only display error output.
    -s, --silent=false: Be silent; don't output anything.
    -v, --verbose=false: Enable verbose output when executing commands.

Description

Sub-command  | Explanation
-------------| ------------------------
list         | Lists all the eggs in the current nest. The output shows the name, version, path, and any additional attributes of each egg in the nest such as dependencies, capabilities, and linker scripts. The newt command gets the attributes of each egg from the corresponsing egg.yml description file.
checkdeps    | 



    