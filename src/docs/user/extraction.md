---
title: Extraction of information
---

Since version `3.0` of EPUBCheck, it's now possible to extract some information while parsing and checking an EPUB file.
This extraction is available in two flavors depending whether you only want to use the command line or if you are ready to customize your own `Report` implementation in Java.

## XML output 

The new `-out` argument can be used to output a xml file containing some information extracted from the input EPUB file.

Calling `java -jar epubcheck.jar -out output.xml file.epub` will generate the file `output.xml` containing information on the `file.epub`, e.g. the EPUB version (`<version>3.0.1</version>`), validation status (`<status>Not well-formed</status>` or `<status>Well-formed</status>`) metadata information (in `properties/property` elements) and error or warning messages.

Two example XML outputs can be found here: [invalid with hints](https://github.com/IDPF/epubcheck/blob/master/src/test/resources/com/adobe/epubcheck/test/opf/Missing_Spine_epub3_expected_results.xml), [valid with hints](https://github.com/IDPF/epubcheck/blob/master/src/test/resources/com/adobe/epubcheck/test/opf/Publication_Metadata_epub3_expected_results.xml). The following is a snippet of the example file with errors and warnings:

```xml
…
<messages>
  <message severity="error" subMessage="OPF-019">OPF-019, FATAL, [Spine tag was not found in the OPF file.], OPS/content.opf</message>
  <message severity="error" subMessage="RSC-005">RSC-005, ERROR, [Error while parsing file 'element "package" incomplete; missing required element "spine"'.], OPS/content.opf (13-11)</message>
  <message severity="error" subMessage="RSC-011">RSC-011, ERROR, [Found a reference to a resource that is not a spine item.], OPS/toc.xhtml (11-36)</message>
  <message severity="info" subMessage="ACC-007">ACC-007, HINT, [Content Documents do not use 'epub:type' attributes for semantic inflection.], OPS/page01.xhtml</message>
  <message severity="info" subMessage="ACC-008">ACC-008, HINT, [Navigation Document has no 'landmarks nav' element.], Missing_Spine_epub3.epub</message>
</messages>
…
```

The output file uses the _jhove_ schema (available at http://hul.harvard.edu/ois/xml/xsd/jhove/jhove.xsd or see the project http://sourceforge.net/projects/jhove/) in order to display the information so that properties of any type can be output.

If you need another schema to work with, you can create a XSL stylesheet in order to transform the given output. If you prefer to directly output another kind of information, you must use the second method explain just below.


## Customizing the `Report` 

In order to generate a specific report, you need to write a new Java class implementing the `com.adobe.epubcheck.api.Report` interface.

In particular, the `info(String resource, FeatureEnum feature, String value)` method will be called during the parsing process each time a particular feature has been detected in the EPUB file. The list of the currently detected features can be found in the `com.adobe.epubcheck.util.FeatureEnum` enumeration.

As a starting point, you can use the `com.adobe.epubcheck.util.XmlReportImpl` class or the `com.adobe.epubcheck.util.ValidationReport` test class.
You might also want to take a look in the default Report implementation in `com.adobe.epubcheck.util.DefaultReportImpl`

Once your new report class is implemented, you should call it by [using EPUBCheck as a Java library](../java-library).
