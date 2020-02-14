---
title: Use as a Java Library
---

You can use EPUBCheck as a library in your Java application. EPUBCheck public interfaces can be found in the `com.adobe.epubcheck.api` package. The `EPUBCheck` class can be used to instantiate a validation engine. Use one of its constructors and then call `validate()` method.

__Basic example__ (snippet):

```java
File epubFile = new File("/path/to/your/epub/file.epub");

// simple constructor; errors are printed on stderr stream
EPUBCheck epubcheck = new EPUBCheck(epubFile);

// validate() returns true if no errors or warnings are found
boolean result = epubcheck.validate();
```

`Report` is an interface that you can implement to get a list of the errors and warnings reported by the validation engine (instead of the error list being printed out on `stderr`). See also how to [customize the validation report](../extraction).

The default ZIP distribution contains all you need to use EPUBCheck as a library.


## Dependency Information

EPUBCheck `jar` releases are available in the [Maven Central Repository](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22epubcheck%22).

To use it as a library in your project, use the dependency information matching your build tool

### Apache Maven

```xml
<dependency>
    <groupId>org.idpf</groupId>
    <artifactId>epubcheck</artifactId>
    <version>4.1.0</version>
</dependency>
```

### Apache Buildr

```ruby
'org.idpf:epubcheck:jar:4.1.0'
```

### Apache Ivy

```xml
<dependency org="org.idpf" name="epubcheck" rev="4.1.0" />
```

### Gradle

```groovy
compile group: 'org.idpf', name: 'epubcheck', version: '4.1.0'
```

### Grails

```groovy
compile 'org.idpf:epubcheck:4.1.0'
```

### Scala SBT

```scala
libraryDependencies += "org.idpf" % "epubcheck" % "4.1.0"
```
