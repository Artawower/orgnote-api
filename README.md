
# Table of Contents

1.  [Introduction](#org62da588)
2.  [Connected links](#org54509d5)
3.  [Extension structure](#org587544b)
    1.  [Folder structure](#org483da30)
    2.  [Extension entrypoint](#org2fbadcd)
    3.  [Extension manifest](#orge2e2fac)
    4.  [Extension API](#org01fbce3)
4.  [Publish to official repository](#orgd9cb5ec)
5.  [Extensions example](#org8bb01bd)
6.  [Contribute guide](#org6a78576)

<div align='center'>

<img src='./images/image.png' width='256px' height='256px'>

</div>

&nbsp;

<div align='center'>

<span class='badge-buymeacoffee'>

<a href='https://www.paypal.me/darkawower' title='Paypal' target='_blank'><img src='https://img.shields.io/badge/paypal-donate-blue.svg' alt='Buy Me A Coffee donate button' /></a>

</span>

<span class='badge-patreon'>

<a href='https://patreon.com/artawower' target='_blank' title='Donate to this project using Patreon'><img src='https://img.shields.io/badge/patreon-donate-orange.svg' alt='Patreon donate button' /></a>

</span>

<a href="https://wakatime.com/badge/github/Artawower/orgnote-api"><img src="https://wakatime.com/badge/github/Artawower/orgnote-api.svg" alt="wakatime"></a>

</div>

<div align='center'>

<a href="https://twitter.com/org_note" target="_blank"><img src="https://img.shields.io/twitter/follow/org_note" alt="Twitter link" /></a>

<a href="https://emacs.ch/@orgnote" target="_blank"><img alt="Mastodon Follow" src="https://img.shields.io/mastodon/follow/113090697216193319?domain=https%3A%2F%2Ffosstodon.org&style=social"></a>

<a href="https://discord.com/invite/SFpUb2vSDm" target="_blank"><img src="https://img.shields.io/discord/1161751315324604417" alt="Discord"></a>

<a href="https://www.youtube.com/@OrgNote" target="_blank"><img alt="YouTube Channel Views" src="https://img.shields.io/youtube/channel/views/UCN14DUE5umdrlEm7odW3gOw"></a>

</div>

<div align='center'>

<a href="https://play.google.com/store/apps/details?id=org.note.app" target="_blank">

<img src="./images/google-play.svg" width="140px" height="auto">

</a>

</div>


<a id="org62da588"></a>

# Introduction

This is API for [OrgNote](https://github.com/artawower/orgnote) extensions.

**Warning** This API is not stable yet, so it can be changed in the future.

You can find all available methods here. They are currently undocumented.


<a id="org54509d5"></a>

# Connected links

-   [Built-in extensions](https://github.com/Artawower/orgnote-client/tree/master/src/components/extensions)
-   [Type definition for existing extension API](https://github.com/Artawower/orgnote-api/blob/master/src/api.ts#L24)
-   [OrgNote entrypoint](https://github.com/artawower/orgnote)
-   [Official website](https://org-note.com/)
-   [Org Note client](https://github.com/Artawower/orgnote-client)
-   [Repository with collection of extensions](https://github.com/Artawower/orgnote-extensions)
-   [Typescript abstract syntax tree for org mode.](https://github.com/Artawower/org-mode-ast)


<a id="org587544b"></a>

# Extension structure


<a id="org483da30"></a>

## Folder structure

**Compiled extension should be placed in the `index.js` file or `/dist/index.js` file in the public GIT repository**


<a id="org2fbadcd"></a>

## Extension entrypoint

Each extension should **export an object by default** with the following structure:

    interface Extension {
      [key: string]: unknown;
    
      onMounted: (api: OrgNoteApi) => Promise<void>;
      onUnmounted?: (api: OrgNoteApi) => Promise<void>;
    }

You can find available methods of `OrgNoteApi` [here](https://github.com/Artawower/orgnote-api/blob/master/src/api.ts#L24)


<a id="orge2e2fac"></a>

## Extension manifest

Also, each extension should export manifest const:

    interface ExtensionManifest {
      /* Should be unique in the extension repo */
      name: string;
      version: string;
      category: 'theme' | 'extension' | 'language pack' | 'other';
      /* OrgNote api semver, 0.13.4 for example */
      apiVersion?: string;
      author?: string;
      description?: string;
      keywords?: string[];
      // Repository url
      sourceType: 'git' | 'file' | 'builtin';
      /* Default value is README.org */
      readmeFilePath?: string;
      /* WIP */
      permissions?: Array<'files' | 'personal info' | '*' | 'third party'>;
      reloadRequired?: boolean;
      sourceUrl?: string;
      sponsor?: string[];
      development?: boolean;
      icon?: string;
    }


<a id="org01fbce3"></a>

## Extension API


<a id="orgd9cb5ec"></a>

# Publish to official repository

OrgNote has an official [repository](https://github.com/Artawower/orgnote-extensions) for user-based extensions. You can easily add new `recipes/<package>.json`
with `ExtensionManifest`


<a id="org8bb01bd"></a>

# Extensions example

*Themes*

-   [Atom One Dark theme (pure js)](https://github.com/Artawower/orgnote-atom-one-dark)

*UI* 

-   [Colorful Headlines (typescript + API package)](https://github.com/Artawower/orgnote-colorful-headlines)


<a id="org6a78576"></a>

# Contribute guide

Any contribution is very much appreciated! Please read the [style guide](./CONTRIBUTE.md) before contributing to avoid misunderstandings!
I would also appreciate it if you would consider becoming my [patron](https://www.patreon.com/artawower)

