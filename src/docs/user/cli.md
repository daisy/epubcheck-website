---
title: Command Line Interface
---

EPUBCheck is a command line tool, all detected errors are simply printed to `stderr` output stream.

There's no native GUI – however, there are some third-party apps offering a GUI. See the [GUI page](../gui) for further details.

## System prerequisites

To run the tool you need Java runtime. Any Operating System should do.

To check if Java is correctly installed you can use the command (from command line interface, *Terminal* or *Command Prompt*):

`java --version`

If Java is correctly installed the command will return the version of Java Runtime installed, otherwise you have to install Java JRE.

To install Java Runtime Enviroment you have two options:

- [Oracle JRE 1.7, 1.8, 9 or 10+](https://www.java.com/en/download/mac_download.jsp)
- [Open JDK 11+](https://jdk.java.net/)

**Note on Java:**
> You need at least JRE or JDK 1.6 to run EPUBCheck on the commandline. However, starting with EPUBCheck 4.0 we *recommend* Java 1.7 or 1.8 to be able to run advanced image checks (Java 1.6 doesn't support those).

**Note on Java on Mac OS X:**
> Due to the change in ownership of the Apple Java version from Apple to Oracle, Java 1.6 (Apple) and Java 1.7+ (Oracle) are kind of incompatible to each other. To run EPUBCheck with advanced image checks in a Mac OS X Terminal, the [Oracle JRE 1.7, 1.8, 9 or 10+](https://www.java.com/en/download/mac_download.jsp) or [Open JDK 11+](https://jdk.java.net/) is required!

## Installation

EPUBcheck is not a standalone software to install at OS level, but it is a *JAR* (*Java ARchive*) package which can be placed anywhere on your file system and must be launched from the command line, using the Java Runtime Enviroment.

To use EPUBcheck from the command line you don't need to start a software installation procedure, just download the latest version from the project repository. The process step-by-step is:

- Locate the latest version of EPUBcheck from the GitHub repository [https://github.com/w3c/epubcheck/releases](https://github.com/w3c/epubcheck/releases) (it's the first one at the top).
- From the **Assets** section download the zip file containing EPUBcheck (the name varies depending on the version with the *epubcheck-x.y.z.zip* pattern)
- Unzip the downloaded zip file
- From the command line go to the unpacked folder with the command `cd /path/to/epubcheck-x.y.z/`
- Launch the command `java -jar epubcheck.jar --version`
- If everything goes correctly the command will return the EPUBcheck version

**Note:**
> EPUBcheck is not a software to install: the unpacked folder can be moved freely in your file system.
Be careful to **always keep together** all the contents of the folder, especially the `epubcheck.jar` file and the `lib/` directory.

## Running from the command line

### Overview of command line arguments

Print the command line help with the `--help` argument:

```
$ java -jar epubcheck.jar --help

EPUBCheck v4.0.2

When running this tool, the first argument should be the name (with the path)
of the file to check.

To specify a validation profile (to run checks against a specific EPUB 3 profile
or extension specification), use the -profile option:

Validation profiles supported:
--profile default // the default validation profile
--profile dict    // validates against the EPUB Dictionaries and Glossaries specification
--profile edupub  // validates against the EDUPUB Profile
--profile idx     // validates against the EPUB Indexes specification
--profile preview // validates against the EPUB Previews specification

If checking a non-epub file, the epub version of the file must
be specified using -v and the type of the file using -mode.
The default version is: 3.0.

Modes and versions supported: 
--mode opf -v 2.0
--mode opf -v 3.0
--mode xhtml -v 2.0
--mode xhtml -v 3.0
--mode svg -v 2.0
--mode svg -v 3.0
--mode nav -v 3.0
--mode mo  -v 3.0 // For Media Overlays validation
--mode exp  // For expanded EPUB archives

This tool also accepts the following options:
--save 	       = saves the epub created from the expanded epub
--out <file>     = output an assessment XML document file (use - to output to console)
--xmp <file>     = output an assessment XMP document file (use - to output to console)
--json <file>    = output an assessment JSON document file (use - to output to console)
-m <file>        = same as --mode
-p <profile>     = same as --profile
-o <file>        = same as --out
-x <file>        = same as --xmp
-j <file>        = same as --json
--failonwarnings[+|-] = By default, the tool returns a 1 if errors are found in the file or 0 if no errors
                        are found.  Using --failonwarnings will cause the process to exit with a status of
                        1 if either warnings or errors are present and 0 only when there are no errors or warnings.
-q, --quiet      = no message on console, except errors, only in the output
-f, --fatal      = include only fatal errors in the output
-e, --error      = include only error and fatal severity messages in ouput
-w, --warn       = include fatal, error, and warn severity messages in output
-u, --usage      = include ePub feature usage information in output
                    (default is OFF); if enabled, usage information will
                    always be included in the output file

-l, --listChecks [<file>] = list message ids and severity levels to the custom message file named <file>
                          or the console
-c, --customMessages [<file>] = override message severity levels as defined in the custom message file named <file>

-h, -? or --help = displays this help message

No file specified in the arguments. Exiting.
epubcheck completed
```

### Validating a packaged EPUB

```
java -jar epubcheck.jar file.epub
```

### Specifying a validation profile

It is possible to specify a validation profile to validate an EPUB (or single file thereof) against a specific IDPF specification.

```
java -jar epubcheck.jar file.epub -profile PROFILE
```

Current profiles include:

* **`default`**: the default validation profile
* **`dict`**: validates against the [EPUB Dictionaries and Glossaries](http://www.idpf.org/epub/dict/epub-dict.html) specification
* **`edupub`**: validates against the [EDUPUB Profile](http://www.idpf.org/epub/profiles/edu/spec/)
* **`idx`**: validates against the [EPUB Indexes](http://www.idpf.org/epub/idx/epub-indexes.html) specification
* **`preview`**: validates against the [EPUB Previews](http://www.idpf.org/epub/previews/) specification

Note: In most cases, it is not required to specify the validation profile explicitly, as it will automatically be set according to `dc:type` metadata in the Publication. Setting the profile explicitly can be useful to detect when such `dc:type` metadata is missing, or to validate single files (see next section).

### Validating a single file

```
java -jar epubcheck.jar singleFile -mode MODE -v VERSION -profile PROFILE
```

 * **MODE** must be one of the following:
  * **`opf`** for package document validation;
  * **`nav`** for navigation document validation (available only for version 3.0);
  * **`mo`** for media overlay validation (available only for version 3.0);
  * **`xhtml`**;
  * **`svg`**;
  * _**`exp`** for Expanded EPUB validation (see the next section)_

 * **VERSION** must be one of
  * `2.0`
  * `3.0`

 * **PROFILE** is optional (see the previous section).

_Note that when validating a single file, only a subset of the available tests is run. Also, when validating a full EPUB, both mode and version are ignored._

### Validating an "expanded" (i.e. unzipped) EPUB

```
java -jar epubcheck.jar folder/ -mode exp [-save]
```

When using expanded mode, there's an optional flag `-save` to save the created archive upon validation.

### Additional flags

 * `-out file.xml` outputs an assessment XML document
 * `-quiet` or `-q` outputs only if there is any warning or error
 * `-help`, `--help` or `-?` displays a help message

## Troubleshooting

### `File not found` error

If EPUBCheck fails because of Unicode characters in file paths, the following command line parameters can be used:

```
java -Dsun.jnu.encoding=UTF8 -Dfile.encoding=UTF8 -jar epubcheck.jar "Mały Książę - Antoine de Saint-Exupéry.epub"
```

("Mały Książę" = "Le Petit Prince" in Polish)

### `java.lang.StackOverflowError`

If EPUBCheck crashes with a `StackOverflowError`, try adjusting the thread stack size of your Java Virtual Machine. With most Java distributions, this can be done by using the `-Xss` option of the `java` command, like in the following example:

```
java -Xss1024k -jar epubcheck.jar moby-dick.epub
```

