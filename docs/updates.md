# Updating owned source

Install and update component source with a chosen CLI release. The bundled snapshot is immutable for that release. Reproducible updates use an exact package version after publication, rather than always using latest.

1. Commit the application's current state, including Tweak-promoted component defaults.
2. Run `tcn diff <components>` using the desired CLI release. This includes shared dependencies.
3. Run `tcn add <components> --dry-run` to inspect the plan.
4. Apply ordinary updates, or review/merge conflicting changes manually. Use `--force` when replacement with registry source is intentional.
5. Run the application's typecheck/tests and review its Gallery/Tweak behavior.

| Local vs installed baseline | Upstream vs baseline | add behavior |
| --- | --- | --- |
| Unmodified | Changed | Update and advance the baseline. |
| Modified | Unchanged | Keep local edits, unless forced. |
| Modified | Changed | Refuse overlapping file replacement; show paths and require review/force. |
| Same as upstream | Any | Leave bytes untouched and update tracking. |
| Missing | Any | Restore from registry. |
| Existing but untracked and different | Any | Refuse replacement unless forced. |

The comparison is per file; edits within one conflicting file are not automatically merged. The manifest retains original installed content so local/upstream differences remain distinguishable. Explicit root ownership persists even if the component also becomes another component's dependency.

CRLF/LF-only differences are ignored when comparing source, so a Windows checkout does not create false local edits. File transaction guards still compare exact bytes. The repository and generated starter also include .gitattributes for consistent LF checkouts.

Files no longer shipped by an upstream component are retained, reported and kept in that component's ownership record. Add never silently deletes retired source. Its previous dependencies remain protected while the retired file exists; migrate usages and remove the component when appropriate. Components retired from the registry can still be removed using installed metadata.

Template changes are separate. An application does not pull new routing/features/configuration automatically when adding UI. Describe architectural changes as migrations; `init --force` on an existing project only reinitializes CLI configuration/adoption and preserves application source/baselines.

Removal checks the installed graph and quoted literal module paths across application source, including test/gallery files. It cannot prove the absence of computed imports assembled at runtime. It conservatively treats matching quoted paths as references. It only deletes tracked source, retains shared units reachable from other explicit components, and retains npm dependencies. Clear application usages before removing source; `--force` never bypasses these checks.

File plans are checked before mutation, guarded against concurrent changes, and written through temporary-file renames under a project lock. I/O errors trigger file-byte rollback; created empty directories may remain. This is not a crash-recovery journal or a filesystem sandbox against another process racing path replacement. If Bun dependency installation fails after source is saved, retry installation in the project.
