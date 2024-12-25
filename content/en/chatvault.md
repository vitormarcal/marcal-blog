---
title: Chatvault
description: How I Preserve My WhatsApp History with ChatVault
author: Vítor Marçal
created_at: 2024-12-25T20:30:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
  - privacidade
  - programacao
  - english
related:
  - "[[tags/notas-pessoais]]"
  - "[[tags/privacidade]]"
  - "[[tags/programacao]]"
  - "[[tags/english]]"
image: img/chatvault/chatvault-blur-enabled.png
language: en
localized_post_paths:
  - "[[chatvault]]"
has_localized_posts: true
---
----

![Screenshot of the ChatVault interface shows a blur effect applied over the message text. On the left, there is a section with a list of chats, each accompanied by its corresponding profile picture. In the center, the open chat displays the message content clearly. On the right, the chat’s image gallery is visible, showing thumbnails of the available images in the gallery.](/img/chatvault/chatvault-blur-enabled.png)


For at least two years, I had an idea in mind: to find an independent solution for recording and accessing my WhatsApp conversations. I've always hated how the backup system works—dependent on circumstances like changing phones, I ended up losing many precious messages. On top of that, I don't like relying on Google to store these data, both for ideological reasons and because I wanted to explore alternatives.

Although I prefer apps like Telegram, I recognize that it's hard to avoid WhatsApp, as it’s essential to stay connected with friends and family. It was while looking for a way to back up and read my conversations outside the app that I started developing my own solution: **[ChatVault](https://github.com/vitormarcal/chatvault)**.

### How ChatVault Works

**ChatVault** is an application that imports WhatsApp chats and makes them available in a user-friendly frontend (at least in theory). The biggest challenge was working around the lack of an official API for exporting messages. Solutions that directly access WhatsApp’s database are problematic because:

1. **Encryption:** The encryption key is hard to access and usually requires rooting the device, which involves formatting the phone and erasing the conversations.
2. **Frequent changes in database structure:** Tables and fields change frequently, making the import code obsolete with every app update.

Luckily, WhatsApp offers a feature to export messages to text or ZIP files. Although limited—it exports up to 100,000 messages (back in 2023, it was only 10,000) and omits some media randomly—this approach was enough to build a robust solution.

### Development and Challenges

Since 2013, I’ve been refining ChatVault. The project has gone through several rewrites: I switched the backend from Node.js to Kotlin, moved the database from SQLite to PostgreSQL, and redesigned the frontend to improve the user experience.

Today, I use ChatVault regularly. The process is simple: I generate the ZIP file on my Android phone, transfer it to my computer, and click "import" in the app interface. I also implemented functionality to import directly from emails, but I prefer to do everything manually.

### Feedback and Limitations

Despite being a niche project, ChatVault has reached 114 stars on GitHub. The biggest challenge reported by users is the initial setup, especially due to the different date formats in exported files. For example, one device might generate dates in the format `2021.01.12 - 05:01:01`, while another uses `21/01/12 05:01:01`. I address these issues as I receive feedback, but I can’t anticipate all possible variations.

I’ve documented these limitations in the project’s README and always encourage users to open issues on GitHub so we can solve them together.

### Future Plans

There are still several improvements I’d like to implement, such as:

- Message search functionality similar to WhatsApp's app.
- Media gallery enhancements.
- Support for cloud storage (Dropbox, Google Drive, etc.).
- Reintroducing SQLite as an option.

Unfortunately, as the sole developer of the project, progress is slow. Other interests compete for my time, but for my needs, **ChatVault** is already “state-of-the-art.”

### Reflection

Maintaining a project for so long can be exhausting, but it’s also rewarding. ChatVault allows me to access my conversations outside WhatsApp and, who knows, maybe even use them with AI in the future to generate interesting insights.

With this post, I hope to showcase and document a project that has consumed so much of my time, been fun to create, and continues to be useful. I might gradually scale back my involvement, but it has already achieved its primary goal.

If you’re curious, check out the [ChatVault repository on GitHub](https://github.com/vitormarcal/chatvault). 😉