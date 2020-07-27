---
title: Messages
---

[//]: # "The following table is generated from a JSON file"
[//]: # "You can find it src/_data/messages.json"
[//]: # "You can check the script that compiles the list in the file src/_data/messages.js"

| Code | Message | Severity | Explanation | Documentation references |
|------|---------|----------|-------------|--------------------------|
{% for area in messages %}{% for message in area[1].messages %}{% if message[1].type == "message" and message[1].severity != "suppressed" %}| {{ message[0] }} | {{ message[1].message }} | <span class="severity {{ message[1].severity }}">{{ message[1].severity }}</span> |  |  |
{% endif %}{% endfor %}{% endfor %}
<style>
	.severity {
		display: inline-block;
		padding: .25em .4em;
		line-height: 1;
		text-align: center;
		white-space: nowrap;
		vertical-align: baseline;
		border-radius: .25rem;
    }
	.severity.warning {
		color: #856404;
		background-color: #fff3cd;
		border-color: #ffeeba;
	}
	.severity.info {
		color: #004085;
		background-color: #cce5ff;
		border-color: #b8daff;
	}
	.severity.error {
		color: #721c24;
		background-color: #f8d7da;
		border-color: #f5c6cb;
	}
	.severity.usage {
		color: #155724;
		background-color: #d4edda;
		border-color: #c3e6cb;
	}
	.severity.fatal {
		color: #1b1e21;
		background-color: #d6d8d9;
		border-color: #c6c8ca;
	}
</style>