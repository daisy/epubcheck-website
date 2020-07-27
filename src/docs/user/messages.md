---
title: Messages
---

[//]: # "The following table is generated from a JSON file"
[//]: # "You can find it src/_data/messages.json"
[//]: # "You can check the script that compiles the list in the file src/_data/messages.js"

| Code | Message | Severity | Explanation | Documentation references |
|------|---------|----------|-------------|--------------------------|
{% for area in messages %}{% for message in area[1]["messages"] %}{% if message[1]["type"] == "message" and message[1]["severity"] != "suppressed" %}| {{ message[0] }} | {{ message[1]["message"] }} | {{ message[1]["severity"] }} |  |  |
{% endif %}{% endfor %}{% endfor %}