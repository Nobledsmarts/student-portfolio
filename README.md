# Student Portfolio and Academic Planner

COS 106 (Introduction to Web Technologies) term project by Franklin Chinedu Richard, Miva Open University.

**Live site:** https://nobledsmarts.github.io/student-portfolio/

A responsive multi-page website built with plain HTML, CSS and JavaScript.

## Pages

| Page | File | What it contains |
|---|---|---|
| Home | `index.html` | Name, photograph, welcome message, navigation, brief biography, audio welcome |
| About me | `about.html` | Educational background (table), career aspirations, technical skills, hobbies |
| Projects | `projects.html` | Three sample projects with descriptions, screenshots and links |
| Academic planner | `planner.html` | Add tasks, mark them completed, delete them (saved in the browser) |
| Contact | `contact.html` | Form with JavaScript validation: no empty fields, valid email, digits-only phone |

## Structure

```
css/style.css     one external stylesheet for every page
js/main.js        mobile menu, active link, footer year
js/planner.js     task management (array + localStorage)
js/contact.js     contact form validation
images/           photograph and project screenshots
assets/           audio clip
```

## Run locally

Open `index.html` in a browser. No build step or server is needed.
