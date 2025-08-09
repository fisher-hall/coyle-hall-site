<p align="center"><img src="assets/images/favicon.png"></img></p>
<h1 align="center">Coyle Hall's Website</h1>

<h3 align="center"><a href="https://www.coylehallnd.com">www.coylehallnd.com</a></h3>

<hr>

## Editing Hall Government information

### Editing a person's biography

Within the <code>./content/english/hall-gov/</code> directory, markdown files are present for the president and vice presidents.
To edit someone's biography, open the corresponding markdown file and put in the corresponding information in the fields.

```yaml
---
title: <name>
email: <email>
image: "/images/headshots/<name>.jpg"
description: <title>
weight: 
params:
    hometown: 
    major: 
    hobbies: 
    favoritepart:
    section:
    
social:
  - name: email
    icon: fa-regular fa-envelope
    link: mailto:<email>
---
```

<em>Note: the <code>params</code> fields' information should be placed within quotes</em>

Finally, a square photo of the person should be placed in the <code>./assets/images/headshots/</code> directory.

### Adding a new person

In the case of a position being added (example: a new vice president), a new markdown file will have to be created. While all the other information can be copied/input using the template above, the <code>weight</code> attribute will have to be changed. The <code>weight</code> attribute determines what order the people's cards show up in, with the lowest (1) showing up first. 
