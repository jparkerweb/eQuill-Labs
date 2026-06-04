---
id: clip-expand
name: clip-expand
slug: clip-expand
tagline: >-
  A lightweight, clipboard-based text expansion tool for Linux systems. Designed
  with Remote Desktop sessions in mind, ClipExpand copies your text snippets
  to...
description:
  short: >-
    A clipboard-based text expansion tool for Linux, designed for local and
    Remote Desktop workflows.
  long: >-
    A clipboard-based text expansion tool for Linux systems, designed with
    Remote Desktop sessions in mind so snippets are copied to the clipboard for
    easy pasting in both local and remote workflows. Snippets are simple text
    files stored in a `~/.clipexpand/` directory with subdirectory support,
    selected through a visual dialog and accessed via a customizable keyboard
    shortcut, with toast notifications confirming each action. It works across
    local X11/Wayland sessions, Remote Desktop (RDP, VNC), and SSH with X
    forwarding on Debian-based distributions. It depends on bash, zenity, xsel,
    and notify-send, and ships an install script that sets everything up.
banner:
  src: 'https://github.com/jparkerweb/clip-expand/raw/main/.readme/clip-expand.jpg'
  alt: clip-expand banner
  source: repo
topics:
  - clipboard
  - linux
  - remote-desktop
  - text-expander
  - equill-utility
category: utility
theme: utilities
primaryLanguage: Shell
languages:
  - name: Shell
    percent: 100
stars: 0
links:
  repo: 'https://github.com/jparkerweb/clip-expand'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-05-12T04:39:48Z'
_source:
  repo: 'https://github.com/jparkerweb/clip-expand'
  sha: HEAD
  fetchedAt: '2026-06-04T15:41:42.191Z'
---
A clipboard-based text expansion tool for Linux systems, designed with Remote Desktop sessions in mind so snippets are copied to the clipboard for easy pasting in both local and remote workflows. Snippets are simple text files stored in a `~/.clipexpand/` directory with subdirectory support, selected through a visual dialog and accessed via a customizable keyboard shortcut, with toast notifications confirming each action. It works across local X11/Wayland sessions, Remote Desktop (RDP, VNC), and SSH with X forwarding on Debian-based distributions. It depends on bash, zenity, xsel, and notify-send, and ships an install script that sets everything up.

## Installation

### Quick Install

Run the install script to automatically set everything up:

```bash
./install.sh
```

The script will:
1. Install required dependencies
2. Copy the script to `~/bin/clipexpand.sh`
3. Create the `~/.clipexpand/` directory
4. Install example snippets
5. Configure the keyboard shortcut (Ctrl+Shift+T)

### Manual Installation

1. **Install dependencies:**

   ```bash
   sudo apt install xsel zenity libnotify-bin
   ```

2. **Copy the script:**

   ```bash
   mkdir -p ~/bin
   cp clipexpand.sh ~/bin/
   chmod +x ~/bin/clipexpand.sh
   ```

3. **Create snippets directory:**

   ```bash
   mkdir -p ~/.clipexpand
   ```

4. **Copy example snippets (optional):**

   ```bash
   cp examples/* ~/.clipexpand/
   ```

5. **Set up keyboard shortcut:**

   **For GNOME/Ubuntu:**

   ```bash
   # Add custom keybinding entry
   gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings \
     "$(gsettings get org.gnome.settings-daemon.plugins.media-keys custom-keybindings | \
     sed "s/]$/, '\/org\/gnome\/settings-daemon\/plugins\/media-keys\/custom-keybindings\/clipexpand\/']/")"

   # Configure the keybinding
   gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/clipexpand/ \
     name 'ClipExpand'
   gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/clipexpand/ \
     command "$HOME/bin/clipexpand.sh"
   gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/clipexpand/ \
     binding '<Ctrl><Shift>t'
   ```

   **For other desktop environments:**

   Use your desktop environment's keyboard settings to create a custom shortcut:
   - **Command:** `~/bin/clipexpand.sh`
   - **Shortcut:** Ctrl+Shift+T (or your preference)
