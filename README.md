# DynamoDB Visual Design

Various pages of AWS documentation describe DynamoDB partition design, often with a visual aid similar to the following:

![Table Design](./tabledesign.png)

[Source][example] ([archive][example-archive])

[example]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
[example-archive]: http://web.archive.org/web/20200414130235if_/https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html

This project attempts to recreate such a visual design, allowing table designers to interactively add partitions, items within partitions, attributes, and so on.

---

This repo doubles as a foray into frontend development with React. It could use significant improvement.

Also, at time of writing it doesn't compile. To be investigated and fixed.
