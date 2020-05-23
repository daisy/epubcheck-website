---
title: Installation Guide
---

## System prerequisites

To run the tool you need Java runtime. Any Operating System should do.

To check if Java is correctly installed you can use the command (from command line interface, *Terminal* or *Command Prompt*):

```
java --version
```

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

To use EPUBcheck from the command line you don't need to start a software installation procedure, just download the [latest version of EPUBcheck](https://daisy.github.io/epubcheck-website/download-latest/) from the project repository, unzip it and start playing with it.

### Windows

On Windows follow these steps:

- Download the [latest version of EPUBcheck](https://daisy.github.io/epubcheck-website/download-latest/)
- Unzip the downloaded zip file
- From the command line go to the unpacked folder with the command `cd /path/to/epubcheck-x.y.z/` (the directory name varies depending on the version, based on *epubcheck-x.y.z* pattern)
- Launch the command `java -jar epubcheck.jar --version`
- If everything goes correctly the command will return the EPUBcheck version

### macOS and Linux

On MacOs or Linux you can use this commands from Terminal to download EPUBcheck and run it in the current working directory:

```
curl -SL {{ githubRelease.latest.url }} | tar -xf -
cd {{ githubRelease.latest.filename }}/
java -jar epubcheck.jar --version
```
If everything goes correctly the command will return the EPUBcheck version.

**Note:**
> EPUBcheck is not a software to install: the unpacked folder can be moved freely in your file system.
Be careful to **always keep together** all the contents of the folder, especially the `epubcheck.jar` file and the `lib/` directory.

#### Packaged versions

EPUBcheck is also available packaged for convenient installation via repository.

##### macOS

Via [Homebrew](https://brew.sh/):

```
brew install epubcheck
```

##### Ubuntu

```
apt-get install epubcheck
```

### Update

Since the software is not installed at OS level, to update EPUBcheck to the latest version, simply [download it](https://daisy.github.io/epubcheck-website/download-latest/) (you can follow the [installation](#installation) steps if you don't know how to do it).

Once downloaded, just replace the old EPUBcheck directory with the new one.