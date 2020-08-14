# DC Mod Manager app for Android

DC Mod Manager is an app for Android that lets you browse mods/skins and install them with a single click. These are only cosmetic changes on your own device, and do not effect gameplay or other players in any way.

## Installation & Updates

You can download the latest APK below or from the [releases page](https://github.com/PhasmaExMachina/dc-mod-manager/releases) by expanding the "Assets" dropdown under the latest release. The easiest way is to download it from your Android phone. See [What is an APK and how do you install one](https://www.androidpit.com/android-for-beginners-what-is-an-apk-file), or [ask Google](http://letmegooglethat.com/?q=how+to+install+apk) if you get stuck.

**[Download latest APK v0.0.7](https://github.com/PhasmaExMachina/dc-mod-manager/releases/download/v0.0.7/dcmodmanager-v0.0.7.apk)**

**Updating** is as easy as installing the newest APK on top of the old one. You should receive an in-app message when a new version is available.

## Features

* Browse virtually every mod ever released
* Live2D preview - based on work by [Arsylk](https://github.com/Arsylk)
* Install mods with the push of a button
* Swap mods into any variant or character - based on work by [Arsylk](https://github.com/Arsylk)
* Automatically handles model_info.json positioning when swapping
* One click tool to restore model_info.json positions after an update
* Create lists of mods installed to specific character variants
* See modder credits and view mods by modder (work in progress)

## Known Issues

A full list of known issues can be found [here](https://github.com/PhasmaExMachina/dc-mod-manager/issues/4), but these are the highlights:

* [DC Mod Manager does not work on Bluestacks or Nox](https://github.com/PhasmaExMachina/dc-mod-manager/issues/4)

## Screenshots

![](https://raw.githubusercontent.com/PhasmaExMachina/dc-mod-manager/master/screenshots/screenshot-1.jpg)

![](https://raw.githubusercontent.com/PhasmaExMachina/dc-mod-manager/master/screenshots/screenshot-2.jpg)

![](https://raw.githubusercontent.com/PhasmaExMachina/dc-mod-manager/master/screenshots/screenshot-3.jpg)

![](https://raw.githubusercontent.com/PhasmaExMachina/dc-mod-manager/master/screenshots/screenshot-4.jpg)

![](https://raw.githubusercontent.com/PhasmaExMachina/dc-mod-manager/master/screenshots/screenshot-5.jpg)

![](https://raw.githubusercontent.com/PhasmaExMachina/dc-mod-manager/master/screenshots/screenshot-6.jpg)

## Credits

This app is powered by the [Destiny Child Mods Archive](https://github.com/PhasmaExMachina/destiny-child-mods-archive) project. The mods in themselves are created by many different people. The goal was always to credit each modder on [the site](https://phasmaexmachina.github.io/destiny-child-mods-archive/) and in this app, but that's a _lot_ of manual work. Check out [this issue](https://github.com/PhasmaExMachina/destiny-child-mods-archive/issues/2) if you want to help out with the initiative.

Many other coders and artists have done work over the years that has made this app possible including, but not limited to:

* [Loki](https://en.wikipedia.org/wiki/Loki) - Modder and author of original mod archive and DC Mod Manager apps, now vanished.
* [Arsylk](https://github.com/Arsylk) - Live2D viewer implementation, [mods forum](https://arsylk.pythonanywhere.com/apk/view_models), swapping, and much more
* TinyBanana
* WhoCares8128
* Envy
* Eljoseto - Site icon

[Icons](https://materialdesignicons.com/)

## Development

* Seems to work best with [JDK v8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html).
* or [JDK v11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).
* Download and install [Android Development Studio](https://developer.android.com/studio)
* Use Android Studio SDK Manager to install Android SDK v28
* Set ANDROID_SDK_ROOT environment variable to the path of the SDK (e.g. C:\Users\USERNAME\AppData\Local\Android\Sdk)
* Accept licences by running $ANDROID_SDK_ROOT/tools/bin/sdkmanager --licenses (sdkmanager.bat on Windows)