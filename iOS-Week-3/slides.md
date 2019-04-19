name: title
layout: true
class: middle, center, large

---

name: poll
layout: true
class: large, center-title

{{content}}

.footnote[Vote at PollEv.com/jacquelineas740]

---

name: default
layout: true
class: large, center-title

---

template: title

# iOS Week 3
## JavaScript in iOS

---

# Summary
What I did in the past two weeks:
  - Looked at two Core APIs that allows Web Frontend Tools inside Native iOS Apps
    - `WKWebView` (Webkit Web View)
    - `JavaScriptCore`
  - Case Studies of JS in iOS
    - WeChat MiniProgram
    - JSBox
  - Plans for Final Project

---

template: title

# PART I: WKWebView and JavaScriptCore
## Two APIs that enabled JS in iOS

---
# Webkit

---
# WKWebView

---
# Loading Content to WKWebView
* Loading from Remote

---
* Loading locally
* Loading Strings

---

# Controlling Loading Behaviors
* Modifying Navigation Policy


---
* Monitoring Page Load
  

---
* Navigate Forward and Backward


---
# Customizing UI


---
# JavaScript Core
Directly use JavaScript in Native Code


---


---
# JSVirtualManchine and JSContext



---
# Passing Values


---
# Passing Functions


---
# Passing Objects


---

template: title

# PART II: Case Studies
## JSBox and WeChat

---

# JSBox: JavaScript Sandbox for iOS

---
# Main Design Idea
Use JavaScript to invoke native method
- All UI Elements are native elements

---

# WeChat: Open Platform for 3rd party scripts


---
# Main Design Idea
Use WKWebView as rendering layer, and use JavaScript as logical layer.
- Only WeChat/Native API-related elements are invoked as native code.

---

template: title

# PART III: Plans for Final Project
## Recreate WeChat Miniprogram Feature

---
# Tentative Requirements: Functionality
1. Load single-file JavaScript programs as String from a server
2. Run each JS program inside a `WKWebView` in a new `UIViewController`
3. Replace each page-transition of a JS program with a new `UIViewController`
4. Enable JS programs to call local native APIs, through `JavaScriptCore`.

---
# Tentative Requirements: User Interface
1. There should be pullable dropdown menu showcasing all the available JS programs.
   - Animated Transition
2. Every JS Programs should not be interactable until the entire script is fully loaded inside a ViewController
3. Replace JS UI with native UI as much as possible.

---

template: title

# The End