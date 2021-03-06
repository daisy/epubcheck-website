---
title: Issues
---

_how issues are organized, how to branch, do PRs, etc_

## How to File an Issue

Fixing bugs is part of our job, but it's not always easy to find the problem correctly and quickly, so we ask for a little help in reporting it to us, in this way we can be faster in solving it.

All reports are collected in the [Issue Tracker](https://github.com/w3c/epubcheck/issues) of the EPUBCheck repository on GitHub. To report a problem just add a [new issue](https://github.com/w3c/epubcheck/issues/new).

In order to be able to check and fix the bug as soon as possible, we need to be able to replicate it locally; for this we need to know the environment in which you are operating, in particular:

- which **EPUBCheck version** you are using (you can use the command `java -jar epubcheck.jar --version` to get it)
- which **Java version** is installed (you can use the `java --version` command to get it)
- which **Operating System** you're using (Windows, macOS or Linux) and which **version**

In addition, too be able to replicate the problem we would need:

- an accurate description of the **steps taken** (e.g. commands used, etc.)
- in some cases, a **test file** to help us highlight the problem immediately. Since the EPUBCheck operations are closely related to the files checked, for the resolution of several bugs it is important to be able to test the tool with the files that generated the bugs; if the file cannot be made public:
	- you can try to make an excerpt of it, proposing only the part of the code related to the problem
	- or you can ask in the issue to be contacted by one of the developers to whom you can send the file privately

## Labels Reference

In order not to get lost among the many issues to manage, we have set up a label system that allows us to quickly identify the various problems according to type, severity and urgency.

The various labels can be combined to describe an issue, for example `priority: low` `type: maintenance` `status: accepted` means that the issue is actually to be fixed, but with low priority (when there will be time) and that it is related to software maintenance operations.

In the following table we explain the organization of the labels.

[//]: # "The following table is generated merging labels metadata from GitHub and local long descriptions"
[//]: # "You can edit the LONG DESCRIPTIONs in the file src/_data/labels_long_descriptions.json"
[//]: # "You can check the script that compiles the list in the file src/_data/githubLabels.js"

| Label | Short description | Long description |
|-------|-------------------|------------------|
{% for label in githubLabels %}| <span id="label_{{ label.id }}" aria-hidden="true">◼</span> {{ label.name }} | {{ label.description }} | {{ label.long_description }} |
{% endfor %}
<style>
	{% for label in githubLabels %}
		#label_{{ label.id }} {
			color: #{{ label.color }};
		}
	{% endfor %}
</style>