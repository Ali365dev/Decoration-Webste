# Domains

| Domain | Package path | Responsibility |
| --- | --- | --- |
| catalog | `packages/domain/src/catalog` | Products, categories, collections |
| cart | `packages/domain/src/cart` | Cart lifecycle |
| checkout | `packages/domain/src/checkout` | Order creation + payment intent |
| orders | `packages/domain/src/orders` | Order reads |
| cms | `packages/domain/src/cms` | Pages, nav, footer, block resolve |
| media | `packages/domain/src/media` | Media library registration |

Database tables for each domain live under `packages/db/src/schema/`.
