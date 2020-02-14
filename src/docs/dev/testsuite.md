---
title: Test Suite
---
<!-- TOC depthfrom:2 -->

- [Introduction](#introduction)
- [Functional Tests](#functional-tests)
    - [Overview](#overview)
    - [A Cucumber Test](#a-cucumber-test)
    - [Steps reference](#steps-reference)
        - [Setting the location of test files](#setting-the-location-of-test-files)
        - [Configuring EPUBCheck](#configuring-epubcheck)
        - [Running EPUBCheck](#running-epubcheck)
        - [Expecting EPUBCheck results](#expecting-epubcheck-results)
    - [Test Files Organization](#test-files-organization)
        - [Directory layout](#directory-layout)
        - [Feature files organization](#feature-files-organization)
        - [Test files organization](#test-files-organization)
    - [Underlying Java code](#underlying-java-code)
- [Unit tests](#unit-tests)
- [Integration tests](#integration-tests)
- [How to Run Tests](#how-to-run-tests)
    - [Running tests from the command line](#running-tests-from-the-command-line)
    - [Running tests from the development environment](#running-tests-from-the-development-environment)
    - [Tips to run and debug a single test](#tips-to-run-and-debug-a-single-test)

<!-- /TOC -->

## Introduction

The primary purpose of EPUBCheck is to assert whether an EPUB publication (or compoenent thereof) conforms to the EPUB specifications.
EPUBCheck is used daily by ebook authors, publishers, and distributors, as a quality assurance tool.
It is crucial that it gives the correct results, so that it can be trusted by the digital publishing industry and community.

Software bugs in EPUBCheck, or flaws in its logic, could result in false positives, or false negatives, or runtime errors:
- A _false positive_ is when EPUBCheck reports that the input does not conform to EPUB specificiations when it is in fact perfectly conforming.
This could cause a valid EPUB to be unjustifiably rejected from a reseller’s ingestion pipeline, for instance.
- A _false negative_ is when EPUBCheck reports that the input conforms to the EPUB specifications when it is in fact non-conforming.
This could cause interoperability issues where an invalid EPUB could not be read correctly on a Reading System expecting valid content.
- A _runtime error_ is when EPUBCheck terminates before even being able to report if the input is or is not conforming to the specifications.
This is also known as a software crash.
The issue here is that users are simply denied an answer to their question about the conformance of their publication.

These three kinds of errors all have obvious negative impacts.

In order to verify that EPUBCheck runs without errors and returns the expected results, the source code includes a series of automated tests. These tests can be grouped into the following categories:
- _[Functional Tests](#functional-tests)_: the tests which verify that EPUBCheck correctly evaluates the conformance to EPUB specifications
- _[Unit Tests](#unit-tests)_: the tests which verify the functionality of a specific part of the code, such as a utility class or an API.
- _[Integration Tests](#integration-tests)_: the tests that verify that the entire system, executed as a whole, functions as expected.

The tests are executed automatically at build time.
They are run for instance by our Continuous Integretion build server whenever new code is pushed to the `master` branch.
Tests can also be executed on demand during the development, individually or not.
For more information on how the tests can be executed, refer to the section [How to Run Tests](#how-to-run-tests).


## Functional Tests

### Overview

EPUBCheck’s _functional tests_ form the biggest and most crucial part of the test suite.
Their role is to verify that EPUBCheck correctly evaluates the conformance criteria defined in the EPUB specifications.

These tests follow a “black box” testing approach:
the principle is to run EPUBCheck on an input file (or set of files), and then to inspect the resulting output, without having to know exactly how the logic is implemented internally.

In order to make the functional tests as readable as possible,
and also understandable and maintainable by people who aren’t necessarily familiar with the Java language,
this part of the test suite relies on the [_Gherkin_ language](https://cucumber.io/docs/guides/overview/#what-is-gherkin) and the [_Cucumber_ tool](https://cucumber.io/docs/guides/overview/#what-is-cucumber).
The Gherkin language allows test cases to be specified in a natural language syntax in plain text files (`.feature` files).
Cucumber is the tool that parses the Gherkin test case specifications and execute the associated Java code to evaluate if the tests pass or fail.

The following sections describe:
- the [anatomy of a Cucumber test](#a-cucumber-test), to understand the basics
- the [reference list of Gherkin steps](#steps-reference) which can be used to specify EPUBCheck test scenarios
- the [directory organization and naming conventions for test files](#test-files-organization)
- the [underlying Java code](#underlying-java-code) for step definitions, Cucumber typing configuration, EPUBCheck glue code, etc. (this section is targeted at EPUBCheck developers, and is not required reading for people who only want to contribute new tests).

### A Cucumber Test

Test cases, also known as _scenarios_ in Cucumber lingo, are defined in _feature files_ (files with a `.feature` extension) as a set of readable instructions, called _steps_.
Here is an example of the content of a simple feature file:

```
Feature: Validate EPUB 3
  
  EPUBCheck should check conformance to the latest EPUB 3 specifications,
  available at: https://www.w3.org/publishing/epub3/

  Background: 
    Given EPUB test files located at '/epub3/files/epub/'
    And EPUBCheck with default settings

  Scenario: valid EPUB
    When checking EPUB 'minimal'
    Then no errors or warnings are reported

  Scenario: invalid EPUB
    When checking EPUB 'schema-error'
    Then error RSC-005 is reported
    And no other errors or warnings are reported
```

This feature file contains two tests, one for a valid EPUB, the other for an invalid EPUB (due to a schema error).
It has a specific structure, and some lines start with a _keyword_ (`Feature`, `Scenario`, `Given`, `When`, `Then`, `And`, etc), but is generally fairly readable.
Let’s take it apart and describe what it means, piece by piece.

The first line of a feature file consists of the keyword `Feature`, followed by a colon and a title:

```
Feature: Validate EPUB 3
```

The title (here, "Validate EPUB 3") should briefly identify the topic or feature being tested.
It will be present in the test report produced by Cucumber, and can be used by the evaluator to know what the tests are about.

The next lines contain a longer description of the topic or feature being tested:

```
  EPUBCheck should check conformance to the latest EPUB 3 specifications,
  available at: https://www.w3.org/publishing/epub3/
```

This longer description is optional.
It can be of any lengh, and ends when the next line starts with a keyword (typically `Background` or `Scenario`).
In the EPUBCheck test suite, the feature description is used to explain what part of the EPUB specifications is tested.

After the feature description comes a `Background` section, here containing two steps:

```
  Background: 
    Given EPUB test files located at '/epub3/files/epub/'
    And EPUBCheck with default settings
```

A _step_ is any line starting with any of the keywords `Given`, `When`, `Then`, `And`, or `But`.
Each step is associated with some Java code (see the section [Underlying Java Code](#underlying-java-code));
Cucumber will execute this code in sequence, one step at a time, when running the tests.
The steps included in a `Background` section will be run before each scenario.
This section is therefore useful to define the initial steps shared by all the tests in the feature file.

In the EPUBCheck test suite, `Background` section is used to define the location where to find the test files, and to specify the EPUBCheck configuration shared by all the tests in the feature.
These steps and their syntax are described at length in the [Steps Reference](#steps-reference).

The rest of the feature file basically consists of `Scenario` sections.
Each scenario describes one test case, as a sequence of steps.
It also has a title, consisting of the text string after the colon character following the `Scenario` keyword.
The scenario titles are arbitrary; they are used to identify the different scenarios in the test report.

For instance, the first `Scenario` in our example feature file is named "valid EPUB" and checks that no errors or warnings are reported when EPUBCheck is run on a minimalistic valid EPUB:

```
  Scenario: valid EPUB
    When checking EPUB 'minimal'
    Then no errors or warnings are reported
```

Because the feature file contains a `Background` section (as seen earlier), the sequence of steps that are actually executed when evaluating this test case are the following:

```
    Given EPUB test files located at '/epub3/files/epub/'
    And EPUBCheck with default settings
    When checking EPUB 'minimal'
    Then no errors or warnings are reported
```

This sequence of steps follows a typical pattern that is found in all the scenarios:

1. description of the initial context (steps `Given` and `And` above)
2. description of an action (step `When`)
3. description of the expected result (step `Then`)

Note that a scenario can have any number of steps.
The keywords `And` and `But` can be used to improve the reading flow.
In fact, the step keywords are not actually differentiated in the underlying implementation, they just improve the readability.
A sequence "_given_ a context, _when_ this happens _and_ this also happens, _then_ this is expected _but_ this isn't expected"
is more readable than the equivalent sequence "_given_ a context, _when_ this happens _when_ this also happens, _then_ this is expected _then_ this isn't expected",
or even the also equivalent but illegible sequence "_then_ a context, _then_ this happens _then_ this also happens, _then_ this is expected _then_ this isn't expected".

The second scenario in our sample feature file describes a test for when EPUBCheck is expected to report an error for an invalid EPUB:

```
  Scenario: invalid EPUB
    When checking EPUB 'schema-error'
    Then error RSC-005 is reported
    And no other errors or warnings are reported
```

At this point, it is important to note that the text of the steps (for instance "checking EPUB 'schema-error'" or "error RSC-005 is reported") is what is used by Cucumber to identify what piece of Java code to execute in order to run the test.
Each step should correspond to a matching _step definition_, i.e. a Java method that implements the step’s logic.

However, test authors typically do not have to write any line of Java code themselves, as the EPUBCheck test suite already includes a collection of step definitions which intend to cover the variety of EPUBCheck test cases.
Writing a new test case for EPUBCheck consists of describing a scenario in a plain text feature file, using any of the readily available steps listed in the [Steps reference](#steps-reference) below.

### Steps reference

_Note_: the steps in this reference are described using the [Cucumber expression](https://cucumber.io/docs/cucumber/cucumber-expressions/) used in the matching step definition. 
In this notation, text in parenthesis is optional text, text in curly brackets identify typed parameters, and text around a slash character denotes alternative spellings.

_Note_: If you’re writing a test and find a use case for a new step that is not in this collection of steps,
please [file an issue](https://github.com/w3c/epubcheck/issues/new) or [submit a pull request](https://github.com/w3c/epubcheck/compare)!

#### Setting the location of test files

---
**Step**: `(EPUB )test files located at {string}`

This step is used to set a base directory where test files can be found.
The `{string}` parameter is the path of the base directory, relative to the `src/test/resources` directory.
Test files are the EPUB content used in the test cases;
they can be expanded EPUB file sets, packaged EPUBs, single content documents, package documents, etc.

**Examples**:
```
Given EPUB test files located at '/epub3/files/epub/'
```

```
Given test files located at '/epub3/files/content-document-xhtml/'
```
---

#### Configuring EPUBCheck

---
**Step**: `EPUBCheck with default settings`

This step is essentially a no-op:
it indicates that EPUBCheck is instantiated with its default configuration.

---
**Step**: `EPUBCheck configured to check a(n) {checkerMode}`

This step is used to configure the type of file expected as input to EPUBCheck.
The `{checkerMode}` parameter can be any of the following values (case insensitive):
- `full publication`
- `Media Overlays Document`
- `Navigation Document`
- `Package Document`
- `SVG Content Document`
- `XHTML Content Document`

**Examples**:
```
Given EPUBCheck configured to check a full publication
```

```
Given EPUBCheck configured to check an XHTML Content Document
```

```
Given EPUBCheck configured to check a navigation document
```

---

#### Running EPUBCheck

---
**Step**: `checking EPUB/document/file {string}`

This step executes EPUBCheck with the given document as input.
The `{string}` parameter is the path of the test document, relative to [the base directory of test files](#setting-the-location-of-test-files).
Given the [flat organization of test files](#test-files-organization), it is typically just the name of the test file (or directory, for expanded EPUBs).

**Examples**:
```
When checking EPUB 'minimal'
```

```
When checking EPUB 'minimal.epub'
```

```
When checking document 'valid-content.xhtml'
```

```
When checking file 'invalid-file.foo'
```

Note that it is possibe to use a `Scenario Outline` (also known as a scenario template) to test several input files using the same step sequence.
For instance:

```
Scenario Outline: valid EPUB <EPUB>
  When checking EPUB '<EPUB>'
  Then no errors or warnings are reported

  Examples:
    | EPUB               |
    | minimal.epub       |
    | fallbacks.epub     |
    | mediaoverlays.epub |
```
---

#### Expecting EPUBCheck results
---
**Step**: `no( other) warning(s)/error(s) or error(s)/warning(s) are/is reported`

This step asserts that the stack of warnings and error messages reported by EPUBCheck is empty.
It may be used either:
- as the first assertion step, to verify that no errors or warnings _at all_ were reported by EPUBCheck,
  i.e. that the input is fully conforming to the specifications.
  In that case, the word "other" should be ommitted ("no warnings or errors are reported").
- following assertion steps which checked that some isses were reported, to verify that no _other_ issues were found.
  In that case, the word "other" should be present ("no other errors or warnings are reported").

It is important to note that the assertion steps _consume_ the messages.
For example, when a test description to use a sequence of assertions like:

```
Then error X is reported
And warning Y is reported
And no other warnings or errors are reported
```

the first step asserts that error X exists in the list of reported messages and consumes it; the next step asserts that warning Y exists and consumes it; finally the last step verifies that the list of messages is left with no other warnings or errors.



**Examples:**
```
Then no errors or warnings are reported
```

```
Then no error is reported
```

```
And no other errors or warnings are reported
```

```
And no other warnings are reported
```

---
**Step**: `(the ){severity} {messageId} is reported`

This step asserts that a specific message (typically a warning or error) was reported by EPUBCheck.
The `{severity}` parameter must be a case-insensitive match to either `ERROR`, `WARNING`, `INFO`, `USAGE`, or `FATAL`.
The `messageId` parameter must be a cases-sensitive match to an EPUBCheck message ID, as defined in the [`MessageId.java` class](https://github.com/w3c/epubcheck/blob/master/src/main/java/com/adobe/epubcheck/messages/MessageId.java) (for example, `RSC-005`, or `PKG-010`, or `OPF-086b`).
Message IDs can use a hyphen ('-') or an underscore ('_') interechangeably.

**Examples:**
```
Then error RSC-005 is reported
```

```
Then WARNING RSC-009 is reported
```

---
**Step**: `(the ){severity} {messageId} is reported {int} time(s)`

This step asserts that a specific message (typically a warning or error) was reported several times by EPUBCheck.
The `{severity}` parameter must be a case-insensitive match to either `ERROR`, `WARNING`, `INFO`, `USAGE`, or `FATAL`.
The `messageId` parameter must be a cases-sensitive match to an EPUBCheck message ID, as defined in the [`MessageId.java` class](https://github.com/w3c/epubcheck/blob/master/src/main/java/com/adobe/epubcheck/messages/MessageId.java) (for example, `RSC-005`, or `PKG-010`, or `OPF-086b`).
Message IDs can use a hyphen ('-') or an underscore ('_') interechangeably.
The `{int}` paraameter must be an integer, equals to the number of times the message is expected to be reported.

It is important to note that this step asserts that the message is reported **at least** the given number of times.
In order to ensure that it is not reported more than that, the step must be combine with a "no other warnings or errors are reported" step.

**Examples:**
```
Then error RSC-005 is reported 3 times
```

```
And warning RSC-009 is reported 1 time
```

---
**Step**: `(the )following {severity}( ID)(s) are/is reported`

This step asserts that a list of messages of a same severity (typically error or warning) are reported by EPUBCheck.
The `{severity}` parameter must be a case-insensitive match to either `ERROR`, `WARNING`, `INFO`, `USAGE`, or `FATAL`.
A list of expected message IDs must be given as a [data table](https://cucumber.io/docs/gherkin/reference/#data-tables), in the fist column.
Each element in the list must be a cases-sensitive match to an EPUBCheck message ID, as defined in the [`MessageId.java` class](https://github.com/w3c/epubcheck/blob/master/src/main/java/com/adobe/epubcheck/messages/MessageId.java) (for example, `RSC-005`, or `PKG-010`, or `OPF-086b`).
Message IDs can use a hyphen ('-') or an underscore ('_') interechangeably.
A second column of the data table can be used to specify a text string that the reported message is expected to contain.

**Examples:**
```
Then the following warning IDs are reported
      | RSC-017 |
      | RSC-018 |
```

```
Then the following errors are reported
      | RSC-005 | attribute "foo" not allowed here |
      | RSC-005 | element "bar" not allowed here   |
```

---
**Step**: `(the )message is {string}`

This step asserts that the text of the last consumed message is equal to the given content.
The `{string}` parameter is the expected text of the message.

This step should only be used after a step that verified that a given message ID was reported.

**Examples:**
```
Then error RSC-005 is reported
And the message is 'attribute "foo" not allowed here'
```

---
**Step**: `(the )message contains {string}`

This step asserts that the text of the last consumed message contains the given content.
The `{string}` parameter is the text that the message is expected to contain.

This step should only be used after a step that verified that a given message ID was reported.

**Examples:**

```
Then error RSC-005 is reported
And the message contains 'Duplicate ID'
```

---

### Test Files Organization

#### Directory layout

The source code in EPUBCheck is following the ususal [Maven standard directory layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html):
- Java test sources are located in the `src/test/java` directory
- test resources are located in the `src/test/resources` directory.

The test resources related to the functional tests consist of the Gherkin feature files and all the test files used as input for EPUBCheck.
The directory layout for the test resources is the following:

1. test resources for EPUB 2 and EPUB 3 are located in distinct top-level directories, respectively named `epub2` and `epub3`, hereafter called _version directories_.
2. each version directory contains:
  - a list of Gherkin feature files (`.feature` extension) describing the tests for the related version of the EPUB specifications.
  How the tests are organized in feature files is further defined in the [Feature files organization](#feature-files-organiztion) section below.
  - a `files` directory containing subdirectories for each type of test files used as input for EPUBCheck (e.g. whole EPUB or single Content Document).
  All the test files are directory contained within these subdirectories.
  The list of subdirectories and the naming convention used for test files are further defined in the [Test files organization](#test-files-organization) section below.

To give an example, the directory layout for functional tests looks like the following file and directory structure:

```
src/test/resources
├── epub2
│   ├── container-epub.feature
│   ├── content-document-xhtml.feature
│   ├── navigation-ncx-document.feature
│   ├── package-document.feature
|   ├── …
|   └── files
│       ├── epub
│       ├── content-document-xhtml
│       ├── ncx-document
│       ├── package-document
│       └── …
└── epub3
    ├── core-container-epub.feature
    ├── core-content-document-xhtml.feature
    ├── core-navigation-document.feature
    ├── core-navigation-epub.feature
    ├── …
    └── files
        ├── epub
        ├── content-document-xhtml
        ├── navigation-document
        ├── package-document
        └── …
```

#### Feature files organization

The EPUBCheck test suite includes hundreds of tests for each version of EPUB.
It would be impractical to include all of them in a single massive feature file.
Instead, tests are distributed in various feature files, organized by tested topic.

As the EPUB format is actually defined in a family of specficiations, the first way to categorize tests is by related specifications.
For example, some feature files describe the tests for the rules defined in the EPUB Packages specification (for example, `core-package-epub.feature`), and other feature files describe the tests for the rules defined in the EPUB Content Document specification (for example, `core-content-document-xhtml.feature`).
Satellite specifications (some of which are not widely adopted, but still supported by EPUBCheck) are also covered in distinct feature files (for example, `indexes-epub.feature` or `edupub-epub.feature`).
In addition, some sections within the specifications are cohesive enough to justify having their own feature file (for example, `core-navigation-epub.feature`, or `core-fixedlayout-epub.feature`).
Finally, a same topic can be split in several feature files depending on the nature of the tested input document (for example, `core-navigation-epub.feature` contains the navigation-related tests based on full EPUB publications, while `core-navigation-document.feature` contains the tests based on validating a single Navigation Document).

By convention, the name of feature files follow this pattern:

```
{specification}-{topic?}-{input-type}-{specialization?}
```

where:
- `{specification}` identifies the specification (or family of specifications) containing the rules being tested, which can be any of:
  - `core`: the core family of EPUB specifications, including EPUB, EPUB Packages, EPUB Content Documents, and EPUB Open Container Format.
  - `dictionaries`: the EPUB Dictionaries specification
  - `edupub`: the EDUPUB specification
  - `indexes`: the EPUB Indexes specification
  - `mediaoverlays`: the EPUB Media Overlays specification
  - _not specified_ for EPUB 2.0.1, which doesn’t have satellite specifications
- `{topic}` may optionally be used to identify the sub-topic being tested, which can be any of:
  - `container`: tests related to the EPUB Open Container Format (OCF)
  - `content`: tests related to EPUB Content Documents
  - `fixedlayout`: tests related to Fixed Layout EPUBs
  - `navigation`: tests related to the EPUB Navigation Document (or NCX in EPUB 2.0.1)
  - `package`: tests related to EPUB Packages
  - `resources`: tests related to Publication Resources
- `{input-type}` is the kind of document being used as input for the tests, which can be any of:
  - `epub`: tests based on the validation of full EPUB publications, either packages (`.epub` files) or unpackages (directories)
  - `content-document`: tests based on the validation of single EPUB Content Documents (e.g. `.xhtml` files)
  - `mediaoverlays-document`: tests based on the validation of single EPUB Media Overlays Documents (`.smil` files)
  - `navigation-document`: tests based on the validation of single EPUB Navigation Documents
  - `ncx-document`: tests based on the validation of single NCX document (EPUB 2.0.1)
  - `package-document`: tests based on the validation of single EPUB Package Documents (`.opf` files)
- `{specialization}` may optionally be used to further differentiate the type of the input document being tested, for instance:
  - `xhtml`: for XHTML Content Documents
  - `svg`: for SVG Content Documents
  - `dtbook`: for DTBook Content Documents (EPUB 2.0.1)

when two consecutive segments of the file name are identical, they are not repeated.
For example, the feature file for tests related to the core Navigation Document rules and using single Navigation Documents as input is named `core-navigation-document.feature` instead of `core-navigation-navigation-document.feature`.

Note: this naming convention is merely used to establish a consistent organization and help with manual test lookup.
It is not relied upon for the execution of the tests;
all the feature files will be automatically detected by Cucumber when running the test suite.

The feature files describing the tests related to the EPUB 3 specifications are:
- `core-container-epub.feature`
- `core-content-document-svg.feature`
- `core-content-document-xhtml.feature`
- `core-content-epub.feature`
- `core-fixedlayout-epub.feature`
- `core-navigation-document.feature`
- `core-navigation-epub.feature`
- `core-package-document.feature`
- `core-package-epub.feature`
- `core-resources-epub.feature`
- `dictionaries-content-document.feature`
- `dictionaries-epub.feature`
- `dictionaries-package-document.feature`
- `edupub-content-document.feature`
- `edupub-epub.feature`
- `edupub-package-document.feature`
- `indexes-content-document.feature`
- `indexes-epub.feature`
- `mediaoverlays-document.feature`
- `mediaoverlays-epub.feature`

The feature files describing the tests related to the EPUB 2.0.1 specifications are:

- `container-epub.feature`
- `content-document-dtbook.feature`
- `content-document-svg.feature`
- `content-document-xhtml.feature`
- `content-epub.feature`
- `navigation-ncx-document.feature`
- `navigation-epub.feature`
- `package-document.feature`
- `package-epub.feature`
- `resources-epub.feature`

Note: this categorization of tests in feature files may not be definitive. The organization can easily be adapted and may evolve depending on test writers and developers feedback. Feel free to [file an issue](https://github.com/w3c/epubcheck/issues/new) or [submit a pull request](https://github.com/w3c/epubcheck/compare) to add a new feature file, or suggest an improvement to this organization.

#### Test files organization

All the functional tests for EPUBCheck are based on running EPUBCheck on a sample input file or directory, and inspecting that the returned messages are conforming to the expectations.
As a result, the test resources directory contains many test files, that are used by the tests described in the feature files.
This section describes the directory structure and naming convention used to to organize this big collection of test material in a consistent and maintainable manner.

_TODO_ further define the naming convention.

### Underlying Java code

__Note: this section is targeted at EPUBCheck developers; it is not required reading for people who only want to contribute new tests_

The Java code implementing the functional tests primarily consists of the following classes:

- Test runners:
  - `RunCucumberTest.java`
  - `DebugCucumberTest.java`
- Step definitions:
  - `ExecutionSteps.java`
  - `AssertionSteps.java`
- Type configuration:
  - `TypeRegistryConfiguration.java`
- Domain classes:
  - `TestReport.java`
  - `MessageInfo.java`

_TODO_: further describe the Java code.


## Unit tests

The list of test classes containing unit tests for the various APIs or helper classes is:

- `com.adobe.epubcheck.api.ApiConstructorsTest.java`
- `com.adobe.epubcheck.ocf.OCFFilenameCheckerTest.java`
- `com.adobe.epubcheck.opf.MetadataSetTest.java`
- `com.adobe.epubcheck.util.DateParserTest.java`
- `com.adobe.epubcheck.util.OPFPeekerTest.java`
- `com.adobe.epubcheck.util.PathUtilTest.java`
- `com.adobe.epubcheck.util.SourceSetTest.java`
- `com.adobe.epubcheck.vocab.PrefixParsingTest.java`
- `com.adobe.epubcheck.vocab.PropertyTest.java`
- `com.adobe.epubcheck.vocab.VocabTest.java`
- `org.idpf.epubcheck.util.css.CssInputStreamTest.java`
- `org.idpf.epubcheck.util.css.CssParserTest.java`
- `org.idpf.epubcheck.util.css.CssScannerTest.java`

_TODO_: describe the topic covered by each test class

## Integration tests

## How to Run Tests

### Running tests from the command line

To run the whole EPUBCheck test suite:
```
mvn clean verify
```

Note that the previous command will run all the functional, unit, and integration tests.
To run all the tests except the integration tests, the following command can be used:
```
mvn clean test
```

It is also possible to run a single test class using the `test` property:

```
mvn -Dtest=VocabTest test
```

_TODO_: describe what the results look like, how to read them.

### Running tests from the development environment

Some development environments support running tests from their UI, either natively or with extension plugins.

In Eclipse, the default JUnit plugin can be used to run all the tests, including the Cucumber functional tests (as they're run trought the JUnit Cucumber test runner).
A Cucumber plugin is also available, which includes formatting for Gherkin feature files, as well as the ability to run Cucumber directly from feature files.

_TODO_: add links to the recommended plugins + list of UI steps to run a test in Eclipse?

### Tips to run and debug a single test

_TODO_: describe how to debug a single Cucumber test, using the `@debug` tag.