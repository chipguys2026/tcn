# Source distribution decisions

Research checked against primary documentation on 2026-11-09:

- [shadcn components.json](https://ui.shadcn.com/docs/components-json): project configuration tells its CLI how to place and customize source. TCN uses tcn.json with physical paths and import aliases, plus a local schema. It omits browser-only fields.
- [shadcn registry-item](https://ui.shadcn.com/docs/registry/registry-item-json): registry items distinguish source dependencies, npm dependencies and files. TCN compiles these relationships from actual source instead of manually duplicating import graphs.
- [shadcn CLI](https://ui.shadcn.com/docs/cli): init/add and inspection commands provide source-copy workflows. TCN adds explicit managed-file removal and an installed-baseline manifest; these are our design choices, not a claim of matching every shadcn behavior.
- [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/): bin provides the installed executable; files defines the distributable payload. The executable runs on Node; the generated OpenTUI application runs on Bun.
- [jsdiff](https://github.com/kpdecker/jsdiff): unified patches use createTwoFilesPatch. The library is bundled into the Node executable and its BSD license is included in third-party notices.

TCN is a source distributor, not a runtime component package. Components can be edited or removed without keeping a runtime TCN dependency. Template upgrades are explicit migrations; registry updates are reviewed source changes. Bundling the registry/template with each CLI release avoids remote availability/version skew in the first implementation. A separate hosted registry can be introduced later with an explicit versioning/validation contract.

The public npm registry reported `tcn` version 0.0.0 during the check. Name ownership is a release prerequisite. No publish operation was performed.
