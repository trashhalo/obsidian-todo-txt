# Obsidian Plugin: Support for todo.txt files

Abandoned. Obsidian API as of Nov 2021 does not provide a clear way to implement new text file formats that integrate into obsidian in the same way that the markdown editor does. This implementation attempted to hijack the markdown editor and turn it into todo.txt. This worked for one version but quickly broke as obsidian team continued to develop new features.

---

Edit [todo.txt](https://github.com/todotxt/todo.txt) files in Obsidian.

![Demo](images/demo-todo-txt.png)


# Installation
Support for 3rd party plugins is enabled in settings (Obsidian > Settings > Third Party plugin > Safe mode - OFF)
To install this plugin, download zip archive from GitHub releases page. Extract the archive into <vault>/.obsidian/plugins.

# Features
- @context is treated as `#tags`
- +Project are treated at `[[Project]]`. You can ctrl click them.
- `_` in +Projects to represent spaces. Ex `+Hello_World`
