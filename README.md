
# Table of Contents

1.  [Introduction](#orged65399)
2.  [Connected links](#orgc368352)
3.  [Extension structure](#org1370386)
    1.  [Folder structure](#org6a7f73b)
    2.  [Extension entrypoint](#orge2d0f79)
    3.  [Extension manifest](#org1e76d43)
    4.  [Extension API](#orgbb09389)
4.  [Publish to official repository](#orgdd94657)
5.  [Extensions example](#orgf459c20)
6.  [Contribute guide](#org383a272)

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

<a href='https://wakatime.com/badge/github/Artawower/orgnote-api'><img src='https://wakatime.com/badge/github/Artawower/orgnote-api.svg' alt='wakatime'></a>

<a href='https://github.com/artawower/orgnote-api/actions/workflows/melpazoid.yml/badge.svg'><img src='https://github.com/artawower/orgnote-api/actions/workflows/melpazoid.yml/badge.svg' alt='ci' /></a>

</div>


<a id="orged65399"></a>

# Introduction

This is API for [OrgNote](https://github.com/artawower/orgnote) extensions.

**Warning** This API is not stable yet, so it can be changed in the future.

You can find all available methods here. They are currently undocumented.


<a id="orgc368352"></a>

# Connected links

-   [Built-in extensions](https://github.com/Artawower/orgnote-client/tree/master/src/components/extensions)
-   [Type definition for existing extension API](https://github.com/Artawower/orgnote-api/blob/master/src/api.ts#L24)
-   [OrgNote entrypoint](https://github.com/artawower/orgnote)
-   [Official website](https://org-note.com/)
-   [Org Note client](https://github.com/Artawower/orgnote-client)
-   [Repository with collection of extensions](https://github.com/Artawower/orgnote-extensions)
-   [Typescript abstract syntax tree for org mode.](https://github.com/Artawower/org-mode-ast)


<a id="org1370386"></a>

# Extension structure


<a id="org6a7f73b"></a>

## Folder structure

**Compiled extension should be placed in the `index.js` file or `/dist/index.js` file in the public GIT repository**


<a id="orge2d0f79"></a>

## Extension entrypoint

Each extension should **export an object by default** with the following structure:

    interface Extension {
      [key: string]: unknown;
    
      onMounted: (api: OrgNoteApi) => Promise<void>;
      onUnmounted?: (api: OrgNoteApi) => Promise<void>;
    }

You can find available methods of `OrgNoteApi` [here](https://github.com/Artawower/orgnote-api/blob/master/src/api.ts#L24)


<a id="org1e76d43"></a>

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


<a id="orgbb09389"></a>

## Extension API


<a id="orgdd94657"></a>

# Publish to official repository

OrgNote has an official [repository](https://github.com/Artawower/orgnote-extensions) for user-based extensions. You can easily add new `recipes/<package>.json`
with `ExtensionManifest`


<a id="orgf459c20"></a>

# Extensions example

*Themes*

-   [Atom One Dark theme (pure js)](https://github.com/Artawower/orgnote-atom-one-dark)

*UI* 

-   [Colorful Headlines (typescript + API package)](https://github.com/Artawower/orgnote-colorful-headlines)


<a id="org383a272"></a>

# Contribute guide

Any contribution is very much appreciated! Please read the [style guide](./CONTRIBUTE.md) before contributing to avoid misunderstandings!
I would also appreciate it if you would consider becoming my [patron](https://www.patreon.com/artawower)

